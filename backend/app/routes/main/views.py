from app.routes.main import main, permission_required, admin_required
from flask import make_response, request, abort, jsonify, current_app
from flask_login import login_user
from flask_jwt_extended import set_access_cookies, unset_jwt_cookies, jwt_required, create_access_token, get_jwt_identity

from app.models import storage
from app.models.user import Client, Worker, User, Administrator

@main.route('/auth/login', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        data = request.get_json()
        user = storage.get_by_email('User', email=data.get('email'))
        if user and user.verify_password(data.get('password')):
            parsed_user = {
            "id": user.id,
            "firstname": user.firstname,
            "lastname": user.lastname,
            'location': user.location,
            'phone': user.phone,
            'type': user.type,
            }
            try:
                parsed_user['paymentMethods'] = [payment.to_json() for payment in user.payment_methods]
            except AttributeError:
                pass
            return make_response(jsonify({"user":parsed_user, "token":create_access_token(identity=user.id)}))
        return make_response({"message": "Invalid Credentials"}), 403
    abort(403)


@main.route('/auth/signup', methods=['POST', 'GET'])
def signup():
    if request.method == 'POST':
        data = request.get_json()
        email = storage.get_by_email(User, data.get('email'))
        if email is not None:
            return make_response(jsonify({"message": "Account already exists"})), 409
        if data.get('work') == True or data.get('user_role') == 'worker':
            user = Worker(**data)
        elif data.get('email').split('@')[1] == current_app.config['ORGANIZATION_DOMAIN']:
            user = Administrator(**data)
        else:
            user = Client(**data)
        user.save()
        if storage.get(user.__class__.__name__, user.id):
            return make_response({"message": "Registration Success"}), 201
        return make_response({"message": "Error creating user account"}), 204
    abort(403)

@main.route('/users/<user_id>')
def get_user(user_id):
    user = storage.get(User, user_id)
    try:
        parsed_user = {
            "id": user.id,
            "firstname": user.firstname,
            "lastname": user.lastname,
            'location': user.location,
            'phone': user.phone,
            'type': user.type,
        }
    
        parsed_user['paymentMethods'] = [payment.to_json() for payment in user.payment_methods]
    except AttributeError:
        pass
    return make_response(parsed_user), 200

@main.route('/workers')
def get_workers():
    return make_response({storage.get_all('Worker')})