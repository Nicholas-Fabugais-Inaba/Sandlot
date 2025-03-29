from sqlalchemy.orm import Session
from sqlalchemy import select, delete, update
from ..create_engine import create_connection
from ..models import Directory


def insert_directory(name, content):
    engine = create_connection()
    with Session(engine) as session:
        directory = Directory(
            name=name,
            content=content
        )
        try:
            session.add_all([directory])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_all_directories():
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(
            Directory.id,
            Directory.name,
            Directory.content
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def update_directory(directory_id, new_name, new_content):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(Directory).where(Directory.id == directory_id).values(name=new_name, content=new_content)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def delete_directory(directory_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = delete(Directory).where(Directory.id == directory_id)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()