#!/usr/bin/env python3
import mimetypes
from flask import (
    Flask, render_template
)

from endpoints import endpoints

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
app.register_blueprint(endpoints)


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
