import os
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from config import config
from app.models.base_model import Base
from app.models.user import User, Administrator, Worker, Client
from app.models.booking import Booking
from app.models.payment import Payment
from app.models.review import Review
from app.models.role import Role
from app.models.service import Service
from app.models.payment_method import PaymentMethod

name2class = {
    'User': User,
    'Administrator': Administrator,
    'Worker': Worker,
    'Client': Client,
    'Booking': Booking,
    'Payment': Payment,
    'Review': Review,
    'Role': Role,
    'Service': Service,
    'PaymentMethod': PaymentMethod
}

class DBStorage:
    __engine = None
    __session = None
    
    def __init__(self) -> None:
        config_name = os.environ.get('CONFIG') or "default"
        self.__engine = create_engine(
            config[config_name].DATABASE_URI,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
            pool_timeout=30,
            pool_recycle=1800
            )
    
    def reload(self) -> None:
        sess_factory = sessionmaker(bind=self.__engine, expire_on_commit=False)
        Base.metadata.create_all(self.__engine)
        self.__session = scoped_session(sess_factory)
    
    def new(self, obj):
        self.__session.add(obj)

    def get(self, cls, id):
        if type(cls) == str:
            cls = name2class[cls]
        return self.__session.query(cls).filter_by(id=id).first()

    def get_all(self, cls):
        """Gets all instances of a class"""
        if type(cls) == str:
            cls = name2class[cls]
        return self.__session.query(cls).all()
    def save(self):
        self.__session.commit()

    def delete(self, obj):
        self.__session.delete(obj)
        
    def get_by_email(self, cls, email):
        if type(cls) == str:
            cls = name2class[cls]
        return self.__session.query(cls).filter_by(email=email).first()
    def get_session(self):
        return self.__session
    
    def count(self, cls, condition=None, value=None):
        if isinstance(cls, str):
            cls = name2class[cls]
        if condition is not None and value is not None:
            result = self.__session.query(cls).filter(getattr(cls, condition) == value ).all()
        result = self.__session.query(cls).all()
        return len(result)