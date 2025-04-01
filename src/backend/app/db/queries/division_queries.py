from sqlalchemy.orm import Session
from sqlalchemy import select, delete
#from ..create_engine import create_connection
from ..models import Team, Division
from ..create_engine import engine

def get_division_name_by_division_id(division_id):
    with Session(engine) as session:
        stmt = (
            select(Division.division_name)
            .select_from(Division)
            .join(Team, Team.division == Division.id)
            .where(Division.id == division_id)
        )
        result = session.execute(stmt).mappings().first()
        return result

def get_division_name_by_team_id(team_id):
    with Session(engine) as session:
        stmt = (
            select(Division.division_name)
            .select_from(Division)
            .join(Team, Team.division == Division.id)
            .where(Team.id == team_id)
        )
        result = session.execute(stmt).mappings().first()
        return result

def get_divisions_season_setup():
    with Session(engine) as session:
        stmt = (
            select(
                Division.id, 
                Division.division_name
            )
        )
        result = session.execute(stmt).mappings().all()
        return result

def insert_division_with_id(division_id, division_name):
    with Session(engine) as session:
        division = Division(
            id=division_id,
            division_name=division_name
        )
        try:
            session.add_all([division])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def delete_all_divisions_except_team_bank():
    with Session(engine) as session:
        stmt = delete(Division).where(Division.id != 0)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True
