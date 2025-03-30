from sqlalchemy.orm import Session
from sqlalchemy import select, delete, update
#from ..create_engine import create_connection
from ..models import Player, Team
from ..create_engine import engine


def insert_player(first_name, last_name, email, password, gender):
    with Session(engine) as session:
        account = Player(
            first_name= first_name,
            last_name = last_name,
            email = email,
            password = password,
            gender = gender
        )
        try:
            session.add_all([account])
        except:
            session.rollback()
            raise
        else:
            session.commit()
            return "player created"

# TODO: change to work with TeamPlayer        
def get_player(login_email):
    with Session(engine) as session:
        stmt = select(
            Player.id, 
            Player.first_name, 
            Player.last_name, 
            Player.email, 
            Player.password, 
            Player.phone_number, 
            Player.gender, 
            Player.team_id, 
            Player.is_commissioner,
            Player.active
        ).where(Player.email == login_email)
        result = session.execute(stmt).mappings().first()
        return result

def get_player_account_data(player_id):
    with Session(engine) as session:
        stmt = select(
            Player.id,
            Player.first_name,
            Player.last_name,
            Player.email,
            Player.gender,
            Player.active
        ).where(Player.id == player_id)
        result = session.execute(stmt).mappings().first()
        return result

def get_player_active_team(player_id):
    with Session(engine) as session:
        stmt = select(Player.team_id, Team.team_name).join(Team, Player.team_id == Team.id).where(Player.id == player_id)
        result = session.execute(stmt).first()
        if result:
            team_id, team_name = result
            return {"team_id": team_id, "team_name": team_name}
        return {"team_id": 0, "team_name": ""}

def update_player_active_team(player_id, team_id):
    with Session(engine) as session:
        stmt = update(Player).where(Player.id == player_id).values(team_id=team_id)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True
        
def delete_player(player_id):
    with Session(engine) as session:
        stmt = delete(Player).where(Player.id == player_id)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
        return "player deleted"

def update_player_password(player_id, new_password):
    with Session(engine) as session:
        stmt = update(Player).where(Player.id == player_id).values(password=new_password)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
        return "password updated"

def update_player_email(player_id, new_email):
    with Session(engine) as session:
        stmt = update(Player).where(Player.id == player_id).values(email=new_email)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
        return "email updated"

def update_player_name(player_id, first_name, last_name):
    with Session(engine) as session:
        stmt = update(Player).where(Player.id == player_id).values(first_name=first_name, last_name=last_name)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
        return "name updated"
