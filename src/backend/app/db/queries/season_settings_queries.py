from sqlalchemy.orm import Session
from sqlalchemy import select, update, delete
#from ..create_engine import create_connection
from ..models import SeasonSettings, Solstice
from ..create_engine import engine

def insert_season_settings(name, start_date, end_date, games_per_team):
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
    with Session(engine) as session:
        stmt = select(
            SeasonSettings.name,
            SeasonSettings.start_date, 
            SeasonSettings.end_date, 
            SeasonSettings.games_per_team
        ).limit(1)  # Limit to 1 row
        result = session.execute(stmt).mappings().first()  # Fetch the first result
        return result

def update_season_settings(start_date, end_date, games_per_team):
    with Session(engine) as session:
        # Dynamically fetch the ID of the first row
        subquery = select(SeasonSettings.id).limit(1)
        stmt = (
            update(SeasonSettings)
            .where(SeasonSettings.id == subquery.scalar_subquery())  # Use the subquery to get the ID
            .values(start_date=start_date, end_date=end_date, games_per_team=games_per_team)
        )
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def update_season_state(new_state):
    with Session(engine) as session:
        # Select the first entry in the table
        stmt = update(SeasonSettings).where(SeasonSettings.id == select(SeasonSettings.id).limit(1)).values(state=new_state)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()

def delete_season_settings(settings_id):
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
    with Session(engine) as session:
        stmt = select(SeasonSettings.state).limit(1)  # Limit to 1 row
        result = session.execute(stmt).mappings().first()
        return result
    
def get_waiver_enabled():
    with Session(engine) as session:
        stmt = select(SeasonSettings.waiver_enabled)
        result = session.execute(stmt).mappings().first()
        return result

def update_waiver_enabled(waiver_enabled):
    with Session(engine) as session:
        stmt = update(SeasonSettings).where(SeasonSettings.id == select(SeasonSettings.id).limit(1)).values(waiver_enabled=waiver_enabled)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()

def get_solstice_settings():
    with Session(engine) as session:
        stmt = select(
            Solstice.active,
            Solstice.start,
            Solstice.end
        )
        result = session.execute(stmt).mappings().first()
        return result
