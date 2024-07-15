from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
import json

import app.models

Base = declarative_base()
date_format = "%Y-%m-%d %H:%M:%S.%2f"

class BaseModel:
    id = Column(String(60), nullable=False, primary_key=True)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)
    
    def __init__(self, **kwargs) -> None:
        self.id = str(uuid4())
        self.created_at = datetime.now()
        self.updated_at = self.created_at
        
        for key, value in kwargs.items():
            if key == '__class__':
                continue
            setattr(self, key, value)
            if type(self.created_at) is str:
                self.created_at = datetime.strptime(self.created_at, date_format)
            if type(self.updated_at) is str:
                self.updated_at = datetime.strptime(self.updated_at, date_format)
        app.models.storage.new(self)
        
    def save(self):
        self.updated_at = datetime.now()
        app.models.storage.save()

    def delete(self):
        app.models.storage.delete(self)
    
    def update(self, attr_dict=None):
        """
            updates the basemodel and sets the correct attributes
        """
        IGNORE = [
            'id', 'created_at', 'updated_at'
        ]
        if attr_dict:
            updated_dict = {
                k: v for k, v in attr_dict.items()
                if k not in IGNORE
                and not k.startswith('_')
                and not k.endswith('_id')
            }
            for key, value in updated_dict.items():
                setattr(self, key, value)
            self.save()

    def __is_serializable(self, obj_v):
        """
            private: checks if object is serializable
        """
        try:
            obj_to_str = json.dumps(obj_v)
            return obj_to_str is not None and isinstance(obj_to_str, str)
        except:
            return False

    def to_json(self, saving_file_storage=False):
        """
            returns json representation of self
        """
        obj_class = self.__class__.__name__
        bm_dict = {
            k: v if self.__is_serializable(v) else str(v)
            for k, v in self.__dict__.items()
        }
        bm_dict.pop('_sa_instance_state', None)
        bm_dict.update({
            '__class__': obj_class
            })
        if not saving_file_storage and obj_class == 'User':
            bm_dict.pop('_password', None)
        return(bm_dict)
            