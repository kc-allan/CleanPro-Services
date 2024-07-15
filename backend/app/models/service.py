from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship

from app.models.base_model import Base, BaseModel

class Service(BaseModel, Base):
    __tablename__ = 'services'
    name = Column(String(25), nullable=False)
    description = Column(String(128), nullable=False)
    price = Column(Integer)

    workers = relationship('Worker', back_populates='service', cascade='all, delete-orphan')
    bookings = relationship('Booking', back_populates='service', cascade='all, delete-orphan')
    
    # def __repr__(self) -> str:
    #     return self.id