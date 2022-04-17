#!/usr/bin/env python3

from flask import (
    Blueprint, jsonify
)
from utils import auth
from srv import accountmgmt as am
from http import HTTPStatus
from srv.tasks_collection import Message

taskscollection = Blueprint(
    'taskscollection', __name__, template_folder='templates')


@taskscollection.route('/api/user/<int:user_id>/tasks', methods=['GET'])
def get_tasks(user_id: int):
    usr = auth.get_username_by_pw_or_session()
    usr_id_auth = am.get_userid(usr)
    if user_id != usr_id_auth:
        return \
            jsonify(message='No permission to access!'), \
            HTTPStatus.UNAUTHORIZED
    rsp = Message.get_msg_by_user(user_id)
    return jsonify([msg.dictify() for msg in rsp]), HTTPStatus.OK
