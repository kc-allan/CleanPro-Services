from uuid import uuid4
from flask import redirect, url_for, render_template, request, make_response, flash
from flask_login import login_required, logout_user, login_user
from flask_admin import Admin, expose, AdminIndexView
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user
from flask_admin.form import Select2Widget
from wtforms_sqlalchemy.fields import QuerySelectField
from flask_admin.actions import action
from flask_admin.model.template import EndpointLinkRowAction
from flask_admin.form import BaseForm
from wtforms import StringField, PasswordField, SelectField
from wtforms.validators import InputRequired, Email, Length

from app.models import storage
from app.models.user import User, Worker, Client, Administrator
from app.models.service import Service
from app.models.booking import Booking
from app.models.role import Role


class AdminDashboard(AdminIndexView):
    @expose('/')
    @login_required
    def index(self):
        users = storage.count(User)
        clients = storage.count(Client)
        workers = storage.count(Worker)
        admins = storage.count(Administrator)
        users_all = storage.get_all(User)
        active, inactive, deactivated = 0, 0, 0
        for user in users_all:
            if user.is_active:
                active += 1
            else:
                inactive += 1
        
        services = storage.get_all(Service)
        services.sort(key=lambda x: len(x.bookings), reverse=True)
        
        bookings = storage.get_all(Booking)
        completed, pending, cancelled, closed, confirmed = 0, 0, 0, 0, 0
        for booking in bookings:
            if booking.status == 'completed':
                completed += 1
            elif booking.status == 'closed':
                closed += 1
            elif booking.status == 'confirmed':
                confirmed += 1
            elif booking.status == 'pending':
                pending += 1
            elif booking.status == 'cancelled':
                cancelled += 1
        
        return self.render('admin/dashboard.html',
                           users=users, clients=clients, workers=workers, active=active, inactive=inactive, deactivated=deactivated,
                           admins=admins, services=services[:3], num_services=len(services),
                           bookings_num=len(bookings), completed=completed, pending=pending, cancelled=cancelled,
                           closed=closed, confirmed=confirmed
                           )
    
    @expose('/login', methods=['GET', 'POST'])
    def login(self):
        if request.method == 'POST':
            data = request.get_json()
            user = storage.get_by_email(User, data.get('email'))
            if user and user.verify_password(data.get('password')):
                login_user(user, duration=3600)
                next = request.args.get('next')
                if next is None or not next.startswith('/'):
                    next = '/'
                return redirect(next)
            return make_response({"message": "Invalid Credentials"}), 403
        return self.render('admin/login.html')
    
    @expose('/logout')
    def logout(self):
        logout_user()
        return redirect('/login')
    
    @expose('/signup')
    def create_admin(self):
        return self.render('admin/signup.html')
    
    @expose('/user/<id>')
    def user_report(self, id):
        user = storage.get(User, id)
        if user is None:
            return self.render('admin/404.html')
        return self.render('admin/user_report.html', user=user)

class BaseAdminView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.type == 'admin'

    def inaccessible_callback(self, name, **kwargs):
        return redirect('/admin/login')

    @expose('/edit/', methods=('GET', 'POST'))
    def edit_view(self, *args, **kwargs):
        # Implementation of edit_view method
        return super().edit_view(*args, **kwargs)


class UserAdminView(BaseAdminView):
    column_list = ('id', 'firstname', 'lastname', 'email', 'is_active', 'created_at', 'type', 'role.name')
    column_labels = {
        'firstname': 'First Name',
        'lastname': 'Last Name',
        'email': 'Email Address',
        'is_active': 'Active Status',
        'created_at': 'Registration Date',
        'type': 'Role Type',
        'role_id': 'Role'
    }
    column_searchable_list = ['email']
    form_columns = ['firstname', 'lastname', 'email', 'phone', 'location', 'role_id']
    column_editable_list = ['firstname', 'lastname', 'email', 'phone', 'location']

    create_template = 'forms/create_user.html'

    list_template = 'custom_list.html'
    
    @action('deactivate', 'Deactivate', 'Are you sure you want to deactivate selected users?')
    def action_deactivate(self, ids):
        try:
            count = 0
            for id in ids:
                user = storage.get(User, id)
                if user == current_user:
                    self.flash('Cannot deactivate yourself.', 'error')
                    continue
                if user:
                    user.is_active = False
                    storage.save(user)
                    count += 1
            flash(f'Successfully deactivated {count} users.', 'success')
        except Exception as e:
            flash(f'Failed to deactivate users: {str(e)}', 'error')

    @expose('/user/<id>/deactivate')
    def deactivate(self, id):
        self.action_deactivate([id])

# Custom ModelView for Service
class ServiceAdminView(BaseAdminView):
    column_list = ('id', 'name', 'price', 'description')
    column_labels = {
        'name': 'Service Name',
        'price': 'Price',
        'description': 'Description'
    }
    column_sortable_list = ['name', 'price']
    column_searchable_list = ['name']
    form_columns = ['name', 'description', 'price']
    
    create_template = 'forms/create_service.html'
    

# Custom ModelView for Booking
class BookingAdminView(BaseAdminView):
    column_list = ('id', 'created_at', 'date', 'completed_on', 'status', 'paid', 'service_id', 'client_id', 'worker_id')
    column_labels = {
        'service_id': 'Service',
        'status': 'Booking Status',
        'paid': 'Paid?',
        'created_at': 'Booking Date',
        'client_id': 'Client',
        'worker_id': 'Worker',
        'date': 'Date Due',
        'completed_on': 'Date Completed'
    }
    column_filters = ['status']
    form_columns = ['date', 'status', 'service_id', 'client_id', 'worker_id']
    
    # create_template = 'forms/create_booking.html'

    def get_service():
        return storage.get_all(Service)
    
    def get_client():
        return storage.get_all(Client)
    
    def get_worker():
        return storage.get_all(Worker)

    form_overrides = {
        'service_id': QuerySelectField,
        'client_id': QuerySelectField,
        'worker_id': QuerySelectField,
        'status': SelectField
    }

    form_args = {
        'status': {
            'choices': [('pending', 'Pending'), ('closed', 'Closed'), ('confirmed', 'Confirmed'), ('completed', 'Completed'), ('cancelled', 'Cancelled')],
        },
        'service_id': {
            'query_factory': get_service,
            'allow_blank': False,
            'widget': Select2Widget(),
            'get_label': 'name',
        },
        'client_id': {
            'query_factory': get_client,
            'allow_blank': False,
            'widget': Select2Widget(),
            'get_label': 'email',
        },
        'worker_id': {
            'query_factory': get_worker,
            'allow_blank': False,
            'widget': Select2Widget(),
            'get_label': 'email',
        }
    }

class AdministratorAdminView(BaseAdminView):
    @expose('/new/')
    def create_view(self):
        return redirect(url_for('user.create_view'))

class ClientAdminView(BaseAdminView):
    @expose('/new/')
    def create_view(self):
        return redirect(url_for('user.create_view'))

class WorkerAdminView(BaseAdminView):
    @expose('/new/')
    def create_view(self):
        return redirect(url_for('user.create_view'))

def setup_admin(app):
    from app.models import storage
    session = storage.get_session()
    admin = Admin(app=app, index_view=AdminDashboard(), template_mode='bootstrap3')
    admin.add_view(UserAdminView(User, session))
    admin.add_view(ServiceAdminView(Service, session))
    admin.add_view(BookingAdminView(Booking, session))
    admin.add_view(AdministratorAdminView(Administrator, session, endpoint='admins'))
    admin.add_view(ClientAdminView(Client, session))
    admin.add_view(WorkerAdminView(Worker, session))
