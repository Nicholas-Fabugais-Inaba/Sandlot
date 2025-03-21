from sqlalchemy.orm import Session
from sqlalchemy import select, delete, update
from ..create_engine import create_connection
from ..models import Player


def insert_player(name, email, password):
    engine = create_connection()
    with Session(engine) as session:
        account = Player(
            first_name=name,
            email=email,
            password=password,
        )
        try:
            session.add_all([account])
        except:
            session.rollback()
            raise
        else:
            session.commit()
            return "player created"
        
def get_player(login_email):
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(Player.id, Player.first_name, Player.last_name, Player.email, Player.password, Player.phone_number, Player.gender, Player.team_id, Player.is_commissioner).where(Player.email == login_email)
        result = session.execute(stmt).mappings().first()
        return result
    
def update_players_team(player_id, team_id):
    engine = create_connection()
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
    engine = create_connection()
    with Session(engine) as session:
        stmt = delete(Player).where(Player.id == player_id)
        session.execute(stmt)
        session.commit()
        return "player deleted"

def update_player_password(player_id, new_password):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(Player).where(Player.id == player_id).values(password=new_password)
        session.execute(stmt)
        session.commit()
        return "password updated"

def update_player_email(player_id, new_email):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(Player).where(Player.id == player_id).values(email=new_email)
        session.execute(stmt)
        session.commit()
        return "email updated"

def update_player_name(player_id, first_name, last_name):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(Player).where(Player.id == player_id).values(first_name=first_name, last_name=last_name)
        session.execute(stmt)
        session.commit()
        return "name updated"
