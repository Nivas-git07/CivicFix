from fastapi import FastAPI, Response, HTTPException, Request, Depends
from .login import load as load_login
from .signup import load as load_signup
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend URL(s)
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://yourdomain.com",
    "https://civicfix.selfmade.solutions"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[*],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(load_login)

app.include_router(load_signup)