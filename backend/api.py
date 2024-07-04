from automatization import *
from flask import request, jsonify, send_file
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity  
from flask_jwt_extended import jwt_required
from models import Item, User, Message, Status
from werkzeug.security import generate_password_hash, check_password_hash
from server import app, db
from datetime import datetime
import os


app.config['SECRET_KEY'] = 'secret_key_template'
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    email = data['email']

    hashed_password = generate_password_hash(password)
    
    new_user = User(username=username, password=hashed_password, email=email, isAdmin = False)
    db.session.add(new_user)
    db.session.commit()

    token = create_access_token(identity=new_user.id)
    
    return jsonify({'access_token': token}), 200


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify({"error": "Invalid credentials"}), 401


@app.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_json()), 200


@app.route('/create_item', methods=['POST'])
@jwt_required()
def create_item():
    user_id = get_jwt_identity()
    url = request.json.get("itemUrl")
    price = request.json.get("itemPrice")
    quantity = request.json.get("itemQuantity")
    status = Status.PENDING

    if not check_url(url):
        status = Status.INCORRECT_URL
        print("Item's url: {url} was incorrect.\n")

    if not url or not price or not quantity:
        return jsonify({"error": "Please provide all required fields"}), 400

    item = Item(url=url, price=float(price), quantity=int(quantity), user_id=user_id, status=status)
    try:
        db.session.add(item)
        db.session.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Item was created!"}), 201


@app.route('/update_item/<int:item_id>', methods=['PATCH'])
@jwt_required()
def update_item(item_id):
    item = Item.query.get(item_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404

    user_id = get_jwt_identity()
    if item.user_id != user_id:
        return jsonify({"error": "Unauthorized access"}), 403

    new_url = request.json.get("itemUrl")
    new_price = request.json.get("itemPrice")
    new_quantity = request.json.get("itemQuantity")

    if not check_url(new_url):
        item.status = Status.INCORRECT_URL
        print("Item's url: {url} was incorrect.\n")

    if new_url:
        item.url = new_url
    if new_price:
        item.price = float(new_price)
    if new_quantity:
        item.quantity = int(new_quantity)

    try:
        db.session.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Item was updated successfully!"})


@app.route('/delete_item/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_item(item_id):
    item = Item.query.get(item_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404

    user_id = get_jwt_identity()
    if item.user_id != user_id:
        return jsonify({"error": "Unauthorized access"}), 403

    db.session.delete(item)
    db.session.commit()

    return jsonify({"message": "Item was deleted successfully!"}), 200


@app.route('/items', methods=['GET'])
@jwt_required()
def get_items():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.isAdmin:
        items = Item.query.all()
    else:
        items = Item.query.filter_by(user_id=user_id).all()
    json_items = [item.to_json() for item in items]
    return jsonify({"items": json_items})


@app.route('/contact', methods=['POST'])
def contact():
    data = request.get_json()
    email = data.get('email')
    subject = data.get('subject')
    text = data.get('text')

    if not email or not subject or not text:
        return jsonify({"error": "All fields are required"}), 400

    message = Message(email=email, subject=subject, text=text)
    db.session.add(message)
    db.session.commit()

    return jsonify({"message": "Message sent successfully"}), 201


@app.route('/messages', methods=['GET'])
@jwt_required()
def get_messages():
    messages = Message.query.order_by(Message.timestamp.desc()).all()
    return jsonify([message.to_json() for message in messages]), 200


@app.route('/automate', methods=['POST'])
@jwt_required()
def automate():
    try:
        user_id = get_jwt_identity()
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        items = Item.query.filter_by(user_id=user_id).all()
        items_to_procces = []
        for item in items:
            if item.status == Status.PENDING:
                item.status = Status.IN_PROGRESS
                print("item was changed\n")
                items_to_procces.append(item)
        
        db.session.commit()

        save_path = "./userFile"
        if not os.path.exists(save_path):
            os.makedirs(save_path)

        file_path = os.path.join(save_path, file.filename)
        file.save(file_path)


        stop_event = threading.Event()

        hour_to_start = int(request.form['hour'])
        while hour_to_start != 0:
            current_time = datetime.now()
            print("Current hour is: {current_time.hour}")
            if current_time.hour == hour_to_start:
                print(f"Starting at hour {hour_to_start}...")
                break
            time.sleep(10)

        while True:
            thread_compile(thread_creation(items_to_procces, stop_event, file_path))
            if not stop_event.is_set():
                break

            if not error_fixer_vpn():
                print("Vpn connection malfunction")
                return jsonify({"error": "Vpn connection malfunction"}), 500

            stop_event.clear()
            print("Vpn fixed and stop_event cleared")

        print("All processes finished successfully!")
        os.remove(file_path)

        return jsonify({"message": "All processes finished successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/calculate", methods=['POST'])
@jwt_required()
def calculate_buy_order_balance():
    price = 0
    url = "https://steamcommunity.com/market/"

    user_id = get_jwt_identity()
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    items = Item.query.filter_by(user_id=user_id).all()
    for item in items:
        if item.status == Status.PENDING:
            price += item.price * item.quantity
            print("Calculated pending item price")

    save_path = "./userFile"
    if not os.path.exists(save_path):
        os.makedirs(save_path)

    file_path = os.path.join(save_path, file.filename)
    file.save(file_path)

    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    driver = webdriver.Chrome(chrome_driver_path, options=options)

    driver.get(url)


    cookies = pickle.load(open(file_path, "rb"))

    for cookie in cookies:
        driver.add_cookie(cookie)

    # Refresh the page to update the state with the loaded cookies
    driver.refresh()
    time.sleep(2)

    wallet_balance = driver.find_element(By.ID, "marketWalletBalanceAmount")
    wallet_balance_text = wallet_balance.text.strip().replace('€', '').replace(',', '.')

    listings_parent = driver.find_element(By.XPATH, "/html/body/div[1]/div[7]/div[4]/div[1]/div[4]/div[2]/div[1]/div[1]/div[4]")
    
    child_divs = listings_parent.find_elements(By.XPATH, "./div")

    for div in child_divs[1:]:
        try:
            quantity_div = div.find_element(By.CLASS_NAME, 'market_listing_right_cell.market_listing_my_price.market_listing_buyorder_qty')
            quantity = int(quantity_div.text.strip())
            
            price_div = div.find_element(By.CLASS_NAME, 'market_listing_right_cell.market_listing_my_price')
            price_text = price_div.text.strip().replace('€', '').replace(',', '.')
        
            if '--' in price_text:
                price_text = price_text.replace('--', '00')
        
            item_price = float(price_text)

            price += item_price * quantity
        except Exception as e:
            print(f"An error occurred: {e}")
            continue

    driver.quit()

    available_balance = float(wallet_balance_text) * 10
    print(f"Avalaible balance is {available_balance}, total balance requested will be: {price}")
    return jsonify({"result": f"Avalaible balance is {available_balance}, total balance requested will be: {price}"}), 200



@app.route('/load_cookies')
def accountCookiesLoading():
    current_timestamp = int(datetime.now().timestamp())

    user_file_name = "account_cookies" + str(current_timestamp + random.randint(1, 100000)) + ".pkl"
    # Create a new instance of the Chrome driver
    driver = webdriver.Chrome("/home/marek/Downloads/chromesubor/chromedriver")

    time.sleep(3)
    driver.get("https://steamcommunity.com/login/home/?goto=market%2F")

    time.sleep(20)

    # Save cookies to a file
    pickle.dump(driver.get_cookies() , open(user_file_name,"wb"))

    driver.quit()

    return user_file_name

@app.route('/delete-file/<filename>', methods=['DELETE'])
def delete_file(filename):
    # Check if the file exists
    if os.path.exists(filename):
        # Delete the file
        os.remove(filename)
        return jsonify({"message": "File deleted successfully"}), 200
    else:
        return jsonify({"error": "File not found"}), 404


@app.route('/download-cookies/<filename>')
def download_cookies(filename):
    # Make sure the file exists
    if os.path.exists(filename):
        return send_file(filename, as_attachment=True)
    else:
        return "File not found", 404

