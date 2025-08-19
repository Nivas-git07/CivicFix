import pydantic import BaseModel
import datetime from date 

class signup(BaseModel):
    username: str
    email: str
    password: str

class login(Basemodel):
    username: str
    password: str