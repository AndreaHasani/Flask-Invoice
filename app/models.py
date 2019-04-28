from app import application, db
from sqlalchemy.ext.declarative import DeclarativeMeta
import json
from datetime import date
from flask_login import UserMixin


class Invoice(db.Model):
    __tablename__ = 'invoice'

    id = db.Column('id', db.String(128), primary_key=True, nullable=False)
    to_name = db.Column('to_name', db.String(128), nullable=False)
    to_address = db.Column('to_address', db.String(128), nullable=False)
    to_city_state = db.Column('to_city_state', db.String(128), nullable=False)
    from_name = db.Column('from_name', db.String(128), nullable=False)
    from_address = db.Column('from_address', db.String(128), nullable=False)
    from_city_state = db.Column(
        'from_city_state', db.String(128), nullable=False)
    items = db.Column('items', db.TEXT(), nullable=False)
    payment_method = db.Column('payment_method', db.String(128), nullable=False)
    payment_email = db.Column('payment_email', db.String(256), nullable=False)
    warranty_description = db.Column(
        'warranty_description', db.Text(), nullable=False)
    warranty_period = db.Column(
        'warranty_period', db.String(128), nullable=False)
    notes_description = db.Column(
        'notes_description', db.Text(), nullable=True)
    issued_date = db.Column('issued_date', db.Date(), nullable=False)
    type = db.Column('type', db.String(64), nullable=False, default="Quote")
    total = db.Column('total', db.Integer(), nullable=False)
    hidden = db.Column('hidden', db.Boolean(), nullable=False, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)


class Users(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column('id', db.Integer(), primary_key=True, nullable=False)
    name = db.Column('name', db.String(128), nullable=False)
    password = db.Column('password', db.String(128), nullable=False)
    invoices = db.relationship('Invoice', backref='user')
    admin = db.Column('admin', db.Boolean(), nullable=False, default=False)

    def __init__(self, id):
        self.id = id


    @property
    def is_admin(self):
        if self.admin:
            return True
        else:
            return False
