from sqlalchemy.orm import Session, aliased
from sqlalchemy import select, or_, delete, update
from ..create_engine import create_connection
from ..models import Player, Team, Game, RescheduleRequest, Field, TimeSlot, SeasonSettings, JoinRequest, Division, Announcement


def insert_team(team_name, username, password, division, preferred_division, preferred_offday, preferred_time):
    engine = create_connection()
    with Session(engine) as session:
        account = Team(
            team_name=team_name,
            username=username,
            password=password,
            division=division,
            preferred_division=preferred_division,
            offday=preferred_offday, 
            preferred_time=preferred_time
        )
        try:
            session.add_all([account])
        except:
            session.rollback()
            raise
        else:
            session.commit()
            return "team created"
        
def get_all_teams():
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(Team.id, Team.team_name, Team.division, Team.offday, Team.preferred_time)
        result = session.execute(stmt).mappings().all()
        return result
    
def get_all_season_teams():
    engine = create_connection()
    with Session(engine) as session:
        stmt = (
            select(Team.id, Team.team_name, Division.division_name, Team.offday, Team.preferred_time)
            .select_from(Team)
            .join(Division, Team.division == Division.id)  # Ensure the division exists in the Division table
        )
        result = session.execute(stmt).mappings().all()
        return result
        
def get_team(login_username):
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(Team.id, Team.team_name, Team.username, Team.password, Team.division, Team.offday, Team.preferred_division, Team.preferred_time).where(Team.username == login_username)
        result = session.execute(stmt).mappings().first()
        return result

# TODO: naming of this query was overhauled, make sure to update any imports of get_team_info_by_current_user
def get_team_players(team_id):
    engine = create_connection()
    with Session(engine) as session:

        stmt = (
            select(Player.id, Player.first_name, Player.last_name, Player.email, Player.phone_number, Player.gender)
            .select_from(Team)
            .join(Player, Team.id == Player.team_id)
            .where(Player.team_id == team_id)
        )

        result = session.execute(stmt).mappings().all()
        return result
    
def update_division(team_id, division):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(Team).where(Team.id == team_id).values(division=division)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True
        
def delete_team(team_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = delete(Team).where(Team.id == team_id)
        session.execute(stmt)
        session.commit()
        return "team deleted"

def update_team_name(team_id, new_name):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(Team).where(Team.id == team_id).values(team_name=new_name)
        session.execute(stmt)
        session.commit()
        return "team name updated"

def update_team_username(team_id, new_username):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(Team).where(Team.id == team_id).values(username=new_username)
        session.execute(stmt)
        session.commit()
        return "team username updated"

def update_team_password(team_id, new_password):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(Team).where(Team.id == team_id).values(password=new_password)
        session.execute(stmt)
        session.commit()
        return "password updated"

def get_teams_season_setup():
    engine = create_connection()
    with Session(engine) as session:
        stmt = (
            select(Team.id, Team.team_name, Team.division, Team.preferred_division, Division.division_name)
            .select_from(Team)
            .join(Division, Division.id == Team.division)
        )
        result = session.execute(stmt).mappings().all()
        return result
