from sqlalchemy.orm import Session
from sqlalchemy import select
#from ..create_engine import create_connection
from ..models import ArchivedTeam
from ..create_engine import engine


def insert_archived_team(name, division_name, standing, year):
    with Session(engine) as session:
        team = ArchivedTeam(
            name = name,
            division_name = division_name,
            standing = standing,
            year = year
        )
        try:
            session.add_all([team])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_all_archived_teams():
    with Session(engine) as session:
        stmt = select(
            ArchivedTeam.id,
            ArchivedTeam.name,
            ArchivedTeam.division_name,
            ArchivedTeam.standing,
            ArchivedTeam.year
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def get_archived_team(name, year):
    with Session(engine) as session:
        stmt = (
            select(
                ArchivedTeam.id,
                ArchivedTeam.name,
                ArchivedTeam.division_name,
                ArchivedTeam.standing,
                ArchivedTeam.year
            ).where(
                ArchivedTeam.name == name,
                ArchivedTeam.year == year
            )
        )
        result = session.execute(stmt).mappings().first()
        return result