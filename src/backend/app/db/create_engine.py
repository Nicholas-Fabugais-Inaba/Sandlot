import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

engine = None

def create_connection():
    global engine
    if engine == None:
        load_dotenv()
        conn_str = os.getenv('CONN_STRING')
        engine = create_engine(conn_str,echo=True)
    return engine