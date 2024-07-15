from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.models.base_model import Base, BaseModel

class Payment(BaseModel, Base):
    __tablename__ = 'payments'
    amount = Column(Integer)
    booking_id = Column(String(60), ForeignKey('bookings.id'))
    payment_method_id = Column(String(60), ForeignKey('payment_methods.id'))

    booking = relationship('Booking', back_populates='payment', uselist=False)
    payment_method = relationship('PaymentMethod', back_populates='payments')
