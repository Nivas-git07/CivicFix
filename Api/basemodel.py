from pydantic import BaseModel
from datetime import date 

class signup(BaseModel):
    username: str
    email: str
    password: str

class login(BaseModel):
    username: str
    password: str