from . import main
from flask import make_response

@main.app_errorhandler(500)
def internal_server_error(error):
    return make_response({"error": "Server Error"}), 500

@main.app_errorhandler(400)
def bad_request(error):
    return make_response({"error": "Invalid Request"}), 400

@main.app_errorhandler(405)
def bad_request(error):
    return make_response({"error": "Method Not Allowed"}), 405

@main.app_errorhandler(404)
def page_not_found(error):
    return make_response({"error": "Page not found"}), 404

@main.app_errorhandler(403)
def unauthorized(error):
    return make_response({"error": "Forbidden"}), 403