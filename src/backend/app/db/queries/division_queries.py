from sqlalchemy.orm import Session
from sqlalchemy import select
from ..create_engine import create_connection
from ..models import Team, Division


def get_division_name_by_division_id(division_id):
    engine = create_connection()
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
    engine = create_connection()
    with Session(engine) as session:
        stmt = (
            select(Division.division_name)
            .select_from(Division)
            .join(Team, Team.division == Division.id)
            .where(Team.id == team_id)
        )
        result = session.execute(stmt).mappings().first()
        return result