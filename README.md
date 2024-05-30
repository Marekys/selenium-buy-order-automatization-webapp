# PB175 - Buy Order Automatization Web App
## Description
Web application that can automaticly put Buy Orders on new and old Steam items.  
Using a chrome selenium and other technologies.
Project is working but is still work in progress.
## Installation
Unzip the project in your folder, cd to the frontend and run:
* A node.js is required to run this command.
```
npm install
```

## Backend Dependencies
- Python3  

You can install it by running this command:
```
sudo apt-get install python3.8
```

- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- Flask-Cors
- Selenium
- Werkzeug
- Python3

You can install them by running this command:
```
pip install Flask Flask-JWT-Extended Flask-SQLAlchemy Flask-Cors selenium Werkzeug
```

- ChromeDriver - need to specify path in the *"backend/automatization.py"* 


## Frontend Dependencies
- react
- react-dom
- react-feather
- node-sass

```
npm install react react-dom react-feather node-sass
```

## How to Run the App
1. Make sure to install all dependecies first using:
   ```
   npm install
   ```
2. To start a database, cd into backend folder and run:
    ```
    python3 main.py
    ```
3. To run frontend, cd into frontend folder and run:
   ```
   npm run dev
   ```


## License
Designed and devoloped by: *Marek Krupa*

## Contact
Email: 536352@fi.muni.cz
