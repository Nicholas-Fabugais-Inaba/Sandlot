from sqlalchemy.orm import Session, aliased
from sqlalchemy import select
from .create_engine import create_connection
from .models import Player, Team, Game

# example insert query to use as reference
def example_insert_query():
    engine = create_connection()
    with Session(engine) as session:
        example_player = Player(
            first_name="John",
            last_name="Doe",
            email="johndoe@gmail.com",
            password="mypassword11",
            phone_number="111-111-1111",
            gender="Male",
        )
        try:
            session.add_all([example_player])
        except:
            session.rollback()
            raise
        else:
            session.commit()

# example select query to use as reference
def example_select_query():
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(Player).where(Player.first_name.in_(["John", "Bob"]))
        result = session.execute(stmt).all()
        # would return result to whatever route called it in practice
        print(result)


# creating account insert query
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
    return True

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
    return True

def get_player(login_email):
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(Player.id, Player.first_name, Player.last_name, Player.email, Player.password, Player.phone_number, Player.gender, Player.team_id).where(Player.email == login_email)
        result = session.execute(stmt).mappings().first()
        return result
    
def get_team(login_username):
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(Team.id, Team.team_name, Team.username, Team.password, Team.division, Team.offday, Team.preferred_division, Team.preferred_time).where(Team.username == login_username)
        result = session.execute(stmt).mappings().first()
        return result

# currently a special query specifically for the scheduler, not to be used from frontend yet  
def get_all_teams():
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(Team.id, Team.team_name, Team.division, Team.offday)
        result = session.execute(stmt).mappings().all()
        return result
    
def insert_game(home_team, away_team, date, time, field):
    engine = create_connection()
    with Session(engine) as session:
        game = Game(
            home_team=home_team,
            away_team=away_team,
            date=date,
            time=time,
            field=field, 
        )
        try:
            session.add_all([game])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_all_games():
    engine = create_connection()
    with Session(engine) as session:
        home_team_alias = aliased(Team, name="home_team")
        away_team_alias = aliased(Team, name="away_team")

        stmt = (
            select(
                Game.id,
                Game.date,
                Game.time,
                Game.field,
                Game.home_team_score,
                Game.away_team_score,
                Game.played,
                home_team_alias.id.label("home_team_id"),
                home_team_alias.team_name.label("home_team_name"),
                away_team_alias.id.label("away_team_id"),
                away_team_alias.team_name.label("away_team_name")
            )
            .join(home_team_alias, Game.home_team_id == home_team_alias.id)
            .join(away_team_alias, Game.away_team_id == away_team_alias.id)
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def get_team_games(team_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(Game.id, Game.home_team, Game.away_team, Game.date, Game.time, Game.field, Game.home_team_score, Game.away_team_score, Game.played).where(Game.home_team == team_id | Game.away_team == team_id)
        result = session.execute(stmt).mappings().all()
        return result

# temporary query
def insert_mock_player(first_name, last_name, email, password, phone_number, gender, team_id):
    engine = create_connection()
    with Session(engine) as session:
        account = Player(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
            phone_number=phone_number,
            gender=gender,
            team_id=team_id,
        )
        try:
            session.add_all([account])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def insert_mock_game(home_team, away_team, date, time, field, home_team_score, away_team_score, played):
    engine = create_connection()
    with Session(engine) as session:
        game = Game(
            home_team_id=home_team,
            away_team_id=away_team,
            date=date,
            time=time,
            field=field,
            home_team_score=home_team_score,
            away_team_score=away_team_score,
            played=played
        )
        try:
            session.add_all([game])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True