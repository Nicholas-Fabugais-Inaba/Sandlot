from sqlalchemy.orm import Session
from sqlalchemy import select, delete, update
from ..create_engine import create_connection
from ..models import Announcement


def insert_announcement(date, title, body):
    engine = create_connection()
    with Session(engine) as session:
        announcement = Announcement(
            date=date,
            title=title,
            body=body
        )
        try:
            session.add_all([announcement])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_all_announcements():
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(
            Announcement.id,
            Announcement.date,
            Announcement.title,
            Announcement.body,
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def update_announcement(announcement_id, new_date, new_title, new_body):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(Announcement).where(Announcement.id == announcement_id).values(date=new_date, title=new_title, body=new_body)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def delete_announcement(announcement_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = delete(Announcement).where(Announcement.id == announcement_id)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()