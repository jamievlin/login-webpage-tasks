#!/usr/bin/env python3

from flask import (
    Blueprint, jsonify, request
)
from utils import auth
from srv import accountmgmt as am
from http import HTTPStatus
from srv.tasks_collection import Message

taskscollection = Blueprint(
    'taskscollection', __name__, template_folder='templates')


@taskscollection.route('/api/user/<int:user_id>/tasks',
                       methods=['GET', 'POST'])
def handle_tasks(user_id: int):
    usr = auth.get_username_by_pw_or_session()
    usr_id_auth = am.get_userid(usr)
    if user_id != usr_id_auth:
        return \
            jsonify(message='No permission to access!'), \
            HTTPStatus.UNAUTHORIZED

    match request.method:
        case 'GET':
            fn = get_tasks
        case 'POST':
            fn = post_tasks
        case _:
            return jsonify(message='No method exists!'), \
                   HTTPStatus.METHOD_NOT_ALLOWED
    return fn(user_id)


def get_tasks(user_id: int):
    rsp = Message.get_msg_by_user(user_id)
    return jsonify([msg.dictify() for msg in rsp]), HTTPStatus.OK


def post_tasks(user_id: int):
    payload = request.get_json()
    txt = payload['text']
    new_msg = Message(None, user_id, text=txt)
    if new_msg.save_to_db() is None:
        return jsonify(message='Server Error'),\
               HTTPStatus.INTERNAL_SERVER_ERROR
    return jsonify(new_msg.dictify()), HTTPStatus.CREATED
