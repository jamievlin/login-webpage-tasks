#!/usr/bin/env python3
from flask import Blueprint
from .login import login_page
from .usermgmt import user_mgmt

endpoints = Blueprint('endpoints', __name__)
endpoints.register_blueprint(login_page)
endpoints.register_blueprint(user_mgmt)

