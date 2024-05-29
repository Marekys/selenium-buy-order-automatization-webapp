from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///usersItemDatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['JWT_SECRET_KEY'] = 'mojtajnykluc'
db = SQLAlchemy(app)
jwt = JWTManager(app)
