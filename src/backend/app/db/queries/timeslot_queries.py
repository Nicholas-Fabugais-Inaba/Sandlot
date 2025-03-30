from sqlalchemy.orm import Session
from sqlalchemy import select, delete
#from ..create_engine import create_connection
from ..models import TimeSlot, Field
from ..create_engine import engine

def insert_timeslot(start, end, field_id, timeslot_id=None):
    with Session(engine) as session:
        timeslot = TimeSlot(
            id=timeslot_id,
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
    with Session(engine) as session:
        stmt = (
            select(
                TimeSlot.id,
                TimeSlot.start,
                TimeSlot.end,
                TimeSlot.field_id,
                Field.field_name
            )
            .join(Field, Field.id == TimeSlot.field_id)  # Join with the Field table
        )
        result = session.execute(stmt).mappings().all()
        return result

def delete_timeslot(timeslot_id):
    with Session(engine) as session:
        stmt = delete(TimeSlot).where(TimeSlot.id == timeslot_id)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()

def delete_all_timeslots():
    with Session(engine) as session:
        stmt = delete(TimeSlot)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True
