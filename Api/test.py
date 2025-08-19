from fastapi import FastAPI, Response, HTTPException, Request, Depends
from .login import load as load_login
from .signup import load as load_signup

app = FastAPI()

app.include_router(load_login)

app.include_router(load_signup)