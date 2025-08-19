import mysql.connector
import psycopg2
def db_connection():
    return psycopg2.connect(
        host = "172.30.20.187",
        user = "nivas",
        password = "spidey",
        dbname = "product"
       
)