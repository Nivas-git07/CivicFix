from api.db from db_connection
from fastapi import APIRouter
import psycopg2
from pydantic import BaseModel
from api.basemodel import signup
from fastapi import FastAPI, Response, HTTPException, Request, Depends

load = APIRouter()


@load.post("/signup")
async def signup_user(user: signup):
    
    conn = db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM users WHERE name = %s", (user.username,))
        if cursor.fetchone():
            raise HTTPException(status_code = 400,detail = "username already exists")
        cursor.execute("INSERT INFO users (name, email, password) VALUES (%s, %s, %s)", (user.username, user.email, user.password))
        conn.commit()
        return {"messase" : "user added successfully"}
 
    except psycopg2.Error as Error:
        raise HTTPException(status_code = 500, detail = "Database error occurred")
    finally:
        cursor.close()
        connn.close()

