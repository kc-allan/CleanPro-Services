from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.models.base_model import Base, BaseModel

class Review(BaseModel, Base):
    __tablename__ = 'reviews'
    booking_id = Column(String(60), ForeignKey('bookings.id'))
    rating = Column(Integer)
    comment = Column(String(128), nullable=False)

    booking = relationship('Booking', back_populates='review', uselist=False)
