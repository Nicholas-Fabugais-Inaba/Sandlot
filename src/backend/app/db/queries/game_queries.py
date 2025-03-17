from sqlalchemy.orm import Session, aliased
from sqlalchemy import select, or_, update
from ..create_engine import create_connection
from ..models import Team, Game


def insert_game(home_team, away_team, date, time, field):
    engine = create_connection()
    with Session(engine) as session:
        game = Game(
            home_team_id=home_team,
            away_team_id=away_team,
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
            .where(or_(Game.home_team_id == team_id, Game.away_team_id == team_id))
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def update_game(game_id, new_date, new_time, new_field):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(Game).where(Game.id == game_id).values(date=new_date, time=new_time, field=new_field)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()

def get_score(game_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(Game.home_team_score, Game.away_team_score).where(Game.id == game_id)
        result = session.execute(stmt).mappings().first()
        return result

def update_score(game_id, home_team_score, away_team_score):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(Game).where(Game.id == game_id).values(home_team_score=home_team_score, away_team_score=away_team_score, played=1)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

# TODO: not sure if this should be in team_queries or game_queries but this seemed more appropriate
def get_standings():
    engine = create_connection()
    with Session(engine) as session:
        team1 = aliased(Team)
        team2 = aliased(Team)
        
        stmt = (
            select(
                Game.home_team_id,
                team1.team_name.label('home_team_name'),
                Game.home_team_score,
                team1.division.label('home_division'),
                Game.away_team_id,
                team2.team_name.label('away_team_name'),
                Game.away_team_score,
                team2.division.label('away_division'),
                Game.played,
                Game.forfeit
            )
            .select_from(Game)
            .join(team1, Game.home_team_id == team1.id)
            .join(team2, Game.away_team_id == team2.id)
        )
        
        result = session.execute(stmt).mappings().all()
        return result