from sqlalchemy.orm import Session
from ..create_engine import create_connection
from ..models import Player, Game


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