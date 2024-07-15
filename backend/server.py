import os
from flask import redirect

from app.models import storage
from app import create_app

config_name = os.getenv('FLASK_CONFIG') or 'default'
app = create_app(config_name)

@app.route('/')
def index():
    return redirect('/admin')

@app.route('/static/<file>')
def images(file):
    if file.split('.')[1] == 'css':
        return app.send_static_file(file)
    return app.send_static_file('images/' + file)

if __name__ == '__main__':
    with app.app_context():
        from app.models.role import Role
        Role.insert_roles()
    app.run(port=5001)
