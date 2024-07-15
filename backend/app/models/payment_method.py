from sqlalchemy import Column, String, Enum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.models.base_model import Base, BaseModel

class PaymentMethod(BaseModel, Base):
    __tablename__ = 'payment_methods'
    method_type = Column(Enum('MPESA', 'Paypal', 'Credit Card'), nullable=False)
    account_number = Column(String(60)) # phone number for MPESA and account number for Card
    account_holder_name = Column(String(60))
    account_email = Column(String(60)) # for paypal
    user_id = Column(String(60), ForeignKey('users.id'))
    default = Column(Boolean, default=False, index=True)
    
    payments = relationship('Payment', back_populates='payment_method', cascade='all, delete-orphan')
    client = relationship('Client', back_populates='payment_methods')
    
    def __repr__(self) -> str:
        return f'{self.method_type} - ***{self.account_number[-4:]}'
