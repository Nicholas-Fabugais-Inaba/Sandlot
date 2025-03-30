from sqlalchemy.orm import Session
from sqlalchemy import select, delete, update
#from ..create_engine import create_connection
from ..models import Player, Team, Division
from ..create_engine import engine

def insert_team(team_name, username, password, division, preferred_division, preferred_offday, preferred_time):
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
    with Session(engine) as session:
        stmt = select(
            Team.id, 
            Team.team_name,
            Team.standing, 
            Team.division, 
            Team.offday, 
            Team.preferred_time,
            Team.active
        )
        result = session.execute(stmt).mappings().all()
        return result

# Gets all teams that are currently assigned to a valid division
def get_all_season_teams():
    with Session(engine) as session:
        stmt = (
            select(Team.id, Team.team_name, Team.division, Division.division_name, Team.offday, Team.preferred_time)
            .select_from(Team)
            .join(Division, Team.division == Division.id)
            .where(Team.division > 0)
        )
        result = session.execute(stmt).mappings().all()
        return result

def get_team(login_username):
    with Session(engine) as session:
        stmt = select(
            Team.id, 
            Team.team_name,
            Team.standing, 
            Team.username, 
            Team.password, 
            Team.division, 
            Team.offday, 
            Team.preferred_division, 
            Team.preferred_time,
            Team.active
        ).where(Team.username == login_username)
        result = session.execute(stmt).mappings().first()
        return result

def get_team_account_data(team_id):
    with Session(engine) as session:
        stmt = select(
            Team.id,
            Team.team_name,
            Team.username,
            Team.division,
            Team.offday,
            Team.preferred_division,
            Team.preferred_time,
            Team.active
        ).where(Team.id == team_id)
        result = session.execute(stmt).mappings().first()
        return result

# TODO: naming of this query was overhauled, make sure to update any imports of get_team_info_by_current_user
# TODO: change to work with TeamPlayers
def get_team_players(team_id):
    with Session(engine) as session:
        stmt = (
            select(
                Player.id, 
                Player.first_name, 
                Player.last_name, 
                Player.email, 
                Player.phone_number, 
                Player.gender,
                Player.active
            )
            .select_from(Team)
            .join(Player, Team.id == Player.team_id)
            .where(Player.team_id == team_id)
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def update_division(team_id, division):
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
    with Session(engine) as session:
        stmt = delete(Team).where(Team.id == team_id)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
        return "team deleted"

def update_team_name(team_id, new_name):
    with Session(engine) as session:
        stmt = update(Team).where(Team.id == team_id).values(team_name=new_name)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
        return "team name updated"

def update_team_username(team_id, new_username):
    with Session(engine) as session:
        stmt = update(Team).where(Team.id == team_id).values(username=new_username)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
        return "team username updated"

def update_team_password(team_id, new_password):
    with Session(engine) as session:
        stmt = update(Team).where(Team.id == team_id).values(password=new_password)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
        return "team password updated"

# TODO: naming of this query might need to be changed
def get_teams_season_setup():
    with Session(engine) as session:
        stmt = (
            select(Team.id, Team.team_name, Team.division, Team.preferred_division, Division.division_name)
            .select_from(Team)
            .join(Division, Division.id == Team.division)
        )
        result = session.execute(stmt).mappings().all()
        return result

def deactivate_all_teams():
    with Session(engine) as session:
        stmt = update(Team).values(active=False)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
        return "all teams deactivated"

def activate_all_teams(): # FOR DEVLOPMENT PURPOSES ONLY TODO REMOVE THIS
    with Session(engine) as session:
        stmt = update(Team).values(active=True)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
        return "all teams activated"
