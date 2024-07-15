from sqlalchemy import Column, String, Boolean, Integer
from sqlalchemy.orm import relationship

from app.models.base_model import Base, BaseModel
import app.models


class Permission:
    MANAGE_ACCOUNT = 1
    BOOK_SERVICE = 2
    MAKE_PAYMENT = 4
    MAKE_REVIEW = 8
    MODIFY_BOOKINGS = 16
    APPLY_JOB = 32
    VIEW_EARNINGS = 64
    MODIFY_SERVICES = 128
    MODIFY_USERS = 256
    ADMIN = 512
    

class Role(BaseModel, Base):
    __tablename__ = 'roles'
    name = Column(String(60), unique=True)
    default = Column(Boolean, default=False, index=True)
    permissions = Column(Integer)
    users = relationship('User', back_populates='role', cascade='all, delete-orphan')
    
    # def __repr__(self) -> str:
    #     return self.name
    
    def add_permission(self, perm):
        if not self.has_permission(perm):
            self.permissions += perm
    
    def remove_permission(self, perm):
        if self.has_permission(perm):
            self.permissions -= perm
    def reset_permissions(self):
        self.permissions = 0
    
    def has_permission(self, perm):
        return self.permissions & perm == perm
    
    @staticmethod
    def insert_roles():
        roles = {
            'Client': [Permission.MANAGE_ACCOUNT, Permission.VIEW_EARNINGS, Permission.APPLY_JOB],
            'Worker': [Permission.MANAGE_ACCOUNT, Permission.BOOK_SERVICE, Permission.MAKE_PAYMENT,
                          Permission.MAKE_REVIEW, Permission.MODIFY_BOOKINGS],
            'Administrator': [Permission.MANAGE_ACCOUNT, Permission.MODIFY_BOOKINGS,
                              Permission.MODIFY_SERVICES, Permission.MODIFY_USERS,
                              Permission.ADMIN],
            }
        default_role = 'Client'
        for r in roles:
            role = app.models.storage.get_session().query(Role).filter_by(name=r).first()
            if role is None:
                role = Role(name=r)
            role.reset_permissions()
            for perm in roles[r]:
                role.add_permission(perm)
            role.default = (role.name == default_role)
            role.save()