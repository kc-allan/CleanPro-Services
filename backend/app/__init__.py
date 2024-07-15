from flask import Flask
from config import config
from flask_login import LoginManager
from flask_jwt_extended import JWTManager
from app.admin import setup_admin
from app.models import storage

login_manager = LoginManager()
login_manager.login_view = '/admin/login'
jwt = JWTManager()

@login_manager.user_loader
def load_user(user_id):
    return storage.get('User', user_id)

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    login_manager.init_app(app)
    jwt.init_app(app)
    setup_admin(app)
    
    from app.routes.main import main
    app.register_blueprint(main)

    return app
