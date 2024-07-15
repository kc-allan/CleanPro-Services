from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from flask_login import UserMixin
from hashlib import sha1
from datetime import datetime

from app.models.role import Role, Permission
from app.models.base_model import Base, BaseModel
from app.models.service import Service
import app.models

class User(BaseModel, UserMixin, Base):
    __tablename__ = 'users'
    id = Column(String(60), primary_key=True)
    firstname = Column(String(25), nullable=False)
    lastname = Column(String(25))
    email = Column(String(60), nullable=False, unique=True)
    phone = Column(String(25))
    _password = Column(String(128), nullable=False)
    location = Column(String(60))
    type = Column(String(50))  # Polymorphic type

    role_id = Column(String(60), ForeignKey('roles.id'))
    role = relationship('Role', back_populates='users', enable_typechecks=False)

    __mapper_args__ = {
        'polymorphic_on': type,
        'polymorphic_identity': 'user',
    }
    
    # def __repr__(self) -> str:
    #     return f'{self.firstname} {self.lastname} - {self.id}'

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if self.role_id is None:
            self.role = app.models.storage.get_session().query(Role).filter_by(default=True).first()

    @property
    def password(self):
        raise AttributeError("Password attribute cannot be accessed outside of instance")

    @password.setter
    def password(self, passwd):
        self._password = sha1(passwd.encode()).hexdigest()

    def verify_password(self, passwd):
        return self._password == sha1(passwd.encode()).hexdigest()

    def can(self, perm):
        return self.role is not None and self.role.has_permission(perm)

    def is_administrator(self):
        return self.can(Permission.ADMIN)

class Administrator(User):
    __tablename__ = 'admins'
    id = Column(String(60), ForeignKey('users.id'), primary_key=True)

    __mapper_args__ = {
        'polymorphic_identity': 'admin',
    }

    @staticmethod
    def add_service(name, description, pricing):
        service = Service(
            name=name, description=description,
            price=pricing
        )
        service.save()

class Worker(User):
    __tablename__ = 'workers'
    id = Column(String(60), ForeignKey('users.id'), primary_key=True)

    bookings = relationship('Booking', back_populates='worker', cascade='all, delete-orphan')
    service = relationship('Service', back_populates='workers')

    service_id = Column(String(60), ForeignKey('services.id'))
    service = relationship('Service', back_populates='workers')

    def apply_booking(self, booking):
        booking.worker_id = self.id
        booking.status = "confirmed"
        self.bookings.append(booking)
        booking.save()

    def complete_booking(self, booking):
        booking.status = 'completed'
        booking.completed_on = datetime.now()
        booking.save()

    __mapper_args__ = {
        'polymorphic_identity': 'worker',
    }

class Client(User):
    __tablename__ = 'clients'
    id = Column(String(36), ForeignKey('users.id'), primary_key=True)

    bookings = relationship('Booking', back_populates='client', cascade='all, delete-orphan')
    payment_methods = relationship('PaymentMethod', back_populates='client', cascade='all, delete-orphan')

    def book_service(self, service_id, date):
        from app.models.booking import Booking
        booking = Booking(
            client_id=self.id, service_id=service_id,
            date=date)
        booking.save()
        if app.models.storage.get(Booking, booking.id) is None:
            return None
        return booking

    def review_work(self, booking, rating, text):
        from app.models.review import Review
        review = Review(
            booking_id=str(booking.id),
            rating=rating,
            comment=text
        )
        review.save()
        return review

    __mapper_args__ = {
        'polymorphic_identity': 'client',
    }
