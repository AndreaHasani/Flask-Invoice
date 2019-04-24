from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from app.config import Configuration
from flask_login import LoginManager

import os

application = Flask(__name__)
APP_DIR = os.path.dirname(os.path.realpath(__file__))
application.config.from_object(Configuration)
db = SQLAlchemy(application)
api = Api(application)
# flask-login
login_manager = LoginManager()
login_manager.init_app(application)
login_manager.login_view = "login"


from app.views import *
from app.restful import api_invoice, api_invoices
from app.filters import *

api.add_resource(api_invoices, '/api/invoices')
api.add_resource(api_invoice, '/api/invoice')

if __name__ == '__main__':
    application.run(host="0.0.0.0")
