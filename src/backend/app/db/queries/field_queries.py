from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from ..create_engine import create_connection
from ..models import Field


def insert_field(field_name):
    engine = create_connection()
    with Session(engine) as session:
        field = Field(
            field_name = field_name
        )
        try:
            session.add_all([field])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_all_fields():
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(
            Field.id,
            Field.field_name
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def delete_field(field_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = delete(Field).where(Field.id == field_id)
        session.execute(stmt)
        session.commit()