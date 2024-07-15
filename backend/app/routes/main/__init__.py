from flask import Blueprint, abort
from functools import wraps
from flask_login import current_user

from app.models.role import Permission

main = Blueprint("main", __name__)

def permission_required(permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.can(permission):
                abort(403)
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def admin_required(f):
    return permission_required(Permission.ADMIN)(f)

from app.routes.main import views, errors
from app.routes.bookings import *
from app.routes.services import *
from app.routes.payments import *
from app.routes.reviews import *
from app.routes.services import *
