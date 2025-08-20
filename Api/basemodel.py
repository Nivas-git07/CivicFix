from pydantic import BaseModel
from datetime import date 

class signup(BaseModel):
    username: str
    email: str
    district: str
    password: str

class login(BaseModel):
    email: str
    password: str