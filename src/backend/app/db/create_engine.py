import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
import urllib.parse

def create_connection():
    load_dotenv()
    params = urllib.parse.quote_plus(os.getenv('CONN_STRING'))
    conn_str = 'mssql+pyodbc:///?odbc_connect={}'.format(params)
    engine = create_engine(conn_str,echo=True)
    return engine