from sqlalchemy.orm import Session
from sqlalchemy import select, update
from ..create_engine import create_connection
from ..models import SeasonSettings


def get_season_settings():
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(
            SeasonSettings.start_date, 
            SeasonSettings.end_date, 
            SeasonSettings.games_per_team
        )
        result = session.execute(stmt).mappings().first()
        return result

def update_season_settings(start_date, end_date, games_per_team):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(SeasonSettings).values(start_date=start_date, end_date=end_date, games_per_team=games_per_team)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

