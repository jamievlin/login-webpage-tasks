#!/usr/bin/env python3
import mimetypes
from flask import (
    Flask, render_template, request, jsonify
)
import typing as ty

import srv.accountmgmt

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)


def get_username_auth() -> ty.Optional[str]:
    auth = request.authorization
    if auth is None:
        return None

    if auth.type == 'basic':
        valid = srv.accountmgmt.verify_login(auth.username, auth.password)
        if valid:
            app.logger.info(f'User {auth.username} login success')
            return auth.username
    else:
        app.logger.info(f'User {auth.username} login failed!')
        return None


@app.route('/api/testlogin', methods=['GET'])
def test_login():
    usr = get_username_auth()
    return jsonify(valid=usr is not None), 200


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
