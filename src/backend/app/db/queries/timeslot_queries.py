from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from ..create_engine import create_connection
from ..models import TimeSlot


def insert_timeslot(start, end, field_id):
    engine = create_connection()
    with Session(engine) as session:
        timeslot = TimeSlot(
            start = start,
            end = end,
            field_id = field_id
        )
        try:
            session.add_all([timeslot])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_all_timeslots():
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(
            TimeSlot.id,
            TimeSlot.start,
            TimeSlot.end,
            TimeSlot.field_id
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def delete_timeslot(timeslot_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = delete(TimeSlot).where(TimeSlot.id == timeslot_id)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()