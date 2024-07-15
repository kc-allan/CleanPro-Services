from flask import make_response, jsonify, request
from flask_jwt_extended import jwt_required

from app.routes.main import main, permission_required
from app.models import storage
from app.models.service import Service

@main.route('/service/create', methods=['POST'])
def create_services():
    data = request.form.to_dict()
    service = storage.get_session().query(Service).filter_by(name = data.get('name').lower()).first()
    if service:
        return make_response(jsonify({"message": "Service already exists"})), 409
    service = Service(**data)
    service.save()
    if service:
        return make_response(jsonify({"message": "Service created successfully"})), 201
    return make_response(jsonify({"message": "Error creating service"})), 204

@main.route('/services')
def get_services():
	services = storage.get_all('Service')
	serv = [service.to_json() for service in services]
	return make_response(jsonify(serv)), 200
