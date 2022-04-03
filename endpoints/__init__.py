#!/usr/bin/env python3
from flask import Blueprint
from .login import login_page

endpoints = Blueprint('endpoints', __name__)
endpoints.register_blueprint(login_page)
