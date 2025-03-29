from sqlalchemy.orm import Session
from sqlalchemy import select, update, delete
from ..create_engine import create_connection
from ..models import SeasonSettings


def insert_season_settings(name, start_date, end_date, games_per_team):
    engine = create_connection()
    with Session(engine) as session:
        settings = SeasonSettings(
            name = name,
            start_date = start_date,
            end_date = end_date,
            games_per_team = games_per_team
        )
        try:
            session.add_all([settings])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_all_season_settings():
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(
            SeasonSettings.id,
            SeasonSettings.name,
            SeasonSettings.start_date, 
            SeasonSettings.end_date, 
            SeasonSettings.games_per_team
        )
        result = session.execute(stmt).mappings().all()
        return result

def get_season_settings():
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(
            SeasonSettings.name,
            SeasonSettings.start_date, 
            SeasonSettings.end_date, 
            SeasonSettings.games_per_team
        )
        result = session.execute(stmt).mappings().first()
        return result

def update_season_settings(start_date, end_date, games_per_team):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(SeasonSettings).where(SeasonSettings.id == 1).values(start_date=start_date, end_date=end_date, games_per_team=games_per_team)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def update_season_state(new_state):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(SeasonSettings).where(SeasonSettings.id == 1).values(state=new_state)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()

def delete_season_settings(settings_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = delete(SeasonSettings).where(SeasonSettings.id == settings_id)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()

def get_season_state():
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(SeasonSettings.state).limit(1)  # Limit to 1 row
        result = session.execute(stmt).mappings().first()
        return result

