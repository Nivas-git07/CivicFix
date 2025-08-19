from Api.db import db_connection
from fastapi import APIRouter
import psycopg2
from pydantic import BaseModel
from Api.basemodel import login
from fastapi import FastAPI, Response, HTTPException, Request, Depends

load = APIRouter()

@load.post("/login")

async def login_user(user: login):
    
    conn = db_connection()    
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT user_id, password FROM users WHERE name = %s", (user.username,))
        result = cursor.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="wrong username ")
        user_pass = result[1]
        if  user_pass != user.password:
            raise HTTPException(status_code=404, detail="wrong password")
        conn.commit()
        return {"message": "login successful", "user_id": result[0]}
    except psycopg2.Error as Error:
        raise HTTPException(status_code=500, detail="Database error occurred")
    finally:
        cursor.close()
        conn.close()

        
        