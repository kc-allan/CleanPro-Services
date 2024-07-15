from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship

from app.models.base_model import Base, BaseModel

class Booking(BaseModel, Base):
    __tablename__ = 'bookings'
    client_id = Column(String(60), ForeignKey('clients.id'))
    worker_id = Column(String(60), ForeignKey('workers.id'))
    service_id = Column(String(60), ForeignKey('services.id'))
    date = Column(DateTime, nullable=False)
    completed_on = Column(DateTime)
    status = Column(String(60), nullable=False, default='pending')
    paid = Column(Boolean, default=False)

    worker = relationship('Worker', back_populates='bookings')
    client = relationship('Client', back_populates='bookings')
    payment = relationship('Payment', back_populates='booking', uselist=False)
    service = relationship('Service', back_populates='bookings')
    review = relationship('Review', back_populates='booking', uselist=False)
    
    # def __repr__(self) -> str:
    #     return f'{self.service.name.title()} - {self.id}'
