#!/usr/bin/env python3
from flask import Blueprint, jsonify
from utils import auth

login_page = Blueprint('login_endpoint', __name__, template_folder='templates')


@login_page.route('/api/testlogin', methods=['GET'])
def test_login():
    usr = auth.get_username_auth()
    return jsonify(valid=usr is not None), 200


@login_page.route('/api/login', methods=['POST'])
def login():
    return jsonify(), 200
