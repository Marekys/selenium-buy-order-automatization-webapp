from server import db
from datetime import datetime
from enum import Enum

class Status(Enum):
    INCORRECT_URL = 0
    PENDING = 1
    IN_PROGRESS = 2
    COMPLETED = 3


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Enum(Status), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='items')

    def to_json(self):
        return {
            "id": self.id,
            "itemUrl": self.url,
            "itemPrice": self.price,
            "itemQuantity": self.quantity,
            "status": str(self.status),
            "user_id": self.user_id,
        }

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    isAdmin = db.Column(db.Boolean)
    items = db.relationship('Item', back_populates='user', lazy='dynamic')

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "isAdmin": self.isAdmin
        }
    
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now)

    def to_json(self):
        return {
            'id': self.id,
            'email': self.email,
            'subject': self.subject,
            'text': self.text,
            'timestamp': self.timestamp
        }