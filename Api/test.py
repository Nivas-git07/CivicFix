from fastapi import FastAPI, Response, HTTPException, Request, Depends
from .login import load as load_login
from .signup import load as load_signup
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend URL(s)
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://yourdomain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(load_login)

app.include_router(load_signup)