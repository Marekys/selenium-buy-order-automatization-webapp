from selenium import webdriver
from selenium.webdriver.common.by import By
from server import db, app
from models import Status, Item
import threading
import time
import os
import pickle
import random

chrome_driver_path = "/home/marek/Downloads/chromesubor/chromedriver"

# Define a function to perform the buying process for a specific item
def buy_process(item, stop_event, file_path):
    with app.app_context():
        url = item.url
        price = item.price
        quantity = item.quantity
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
        print("Logged in")

        page_info = driver.find_element(By.ID, "mainContents")

        # Reload the page until the items get there, break if it shows up
        while len(page_info.text) < 200:
            if (page_info.text == "Error") or stop_event.is_set():
                threading.Event.set(stop_event)
                print(f"Exiting unsuccessfully: {url}")
                driver.quit()
                return False
            sleep_time = random.uniform(8, 12)
            print(f"Refreshing {url}")
            driver.refresh()
            time.sleep(sleep_time)
            page_info = driver.find_element(By.ID, "mainContents")

        print(f" ====== Item {url} found! =====")

        # Click the buy order button
        driver.find_element(By.CLASS_NAME, "btn_green_white_innerfade").click()

        # Accept the terms
        driver.find_element(By.ID, "market_buyorder_dialog_accept_ssa").click()

        # Input price
        driver.find_element(By.ID, "market_buy_commodity_input_price").clear()
        driver.find_element(By.ID, "market_buy_commodity_input_price").send_keys(str(price))

        # Input quantity
        driver.find_element(By.ID, "market_buy_commodity_input_quantity").clear()
        driver.find_element(By.ID, "market_buy_commodity_input_quantity").send_keys(str(quantity))

        # Purchase
        driver.find_element(By.ID, "market_buyorder_dialog_purchase").click()

        print(f"Purchase for item {url} complete!")
        item_db = Item.query.get(item.id)

        item_db.status = Status.COMPLETED
        db.session.commit()
        driver.quit()

        return True

def calculating_processe_price(processess):
    price = 0
    for each in processess:
        nam, x, y = each
        price += x * y
    print(price)
    return 0

def check_url(url):
    # Check if the URL contains the required string
    if "steamcommunity.com/market/listings/" in url:
        # Check if the URL ends with a space
        if not url.endswith(" "):
            return True
    return False

def error_fixer_vpn():
    print("Disconnecting VPN")
    os.system("nordvpn disconnect cz")
    time.sleep(3)

    print("Connecting a new VPN")
    os.system("nordvpn connect cz")
    time.sleep(5)

# WIP
#    result = subprocess.run(["nordvpn status"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)

    # Check the output
#    if (len(result.stdout) < 30):                        # 30 is just random longer than Status: Disconnected
#        return False
    return True

def thread_creation(items_to_procces, stop_event, file_path):
    # Create threads for each process
    print("Start of threading")
    threads = []
    for item in items_to_procces:
        thread = threading.Thread(target=buy_process, args=(item, stop_event, file_path))
        threads.append(thread)
        thread.start()        
    return threads

def thread_compile(threads):
    # Wait for all threads to finish
    if len(threads) == 0:
        print("No threads were created")

    for thread in threads:
        thread.join()

def thread_func(processes):
    thread_compile(thread_creation(processes))
