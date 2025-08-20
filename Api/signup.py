from Api.db import db_connection
from fastapi import APIRouter
import psycopg2
from pydantic import BaseModel
from Api.basemodel import signup
from fastapi import FastAPI, Response, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware


load = APIRouter()


@load.post("/signup")
async def signup_user(user: signup):
    #  print(user.dict()) 
    
    conn = db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM users WHERE username = %s", (user.username,))
        if cursor.fetchone():
            raise HTTPException(status_code = 400,detail = "username already exists")
        cursor.execute("INSERT INTO users (username, email, district, password) VALUES (%s, %s, %s,%s )", (user.username, user.email,user.district, user.password))
        conn.commit()
        return {"messase" : "user added successfully"}
 
    except psycopg2.Error as Error:
        raise HTTPException(status_code = 500, detail = "Database error occurred")
    finally:
        cursor.close()
        conn.close()



