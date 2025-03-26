from sqlalchemy.orm import Session
from sqlalchemy import select, delete, update
from ..create_engine import create_connection
from ..models import TeamPlayers, Team, Player


def insert_team_player(team_id, player_id):
    engine = create_connection()
    with Session(engine) as session:
        TeamPlayer = TeamPlayers(
            team_id = team_id,
            player_id = player_id
        )
        try:
            session.add_all([TeamPlayer])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_players_teams(player_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = (
            select(
                TeamPlayers.team_id,
                Team.team_name
            )
            .select_from(TeamPlayers)
            .join(Team, TeamPlayers.team_id == Team.id)
            .where(TeamPlayers.player_id == player_id)
        )
        result = session.execute(stmt).mappings().all()
        return result

def get_teams_players(team_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = (
            select(
                TeamPlayers.player_id,
                TeamPlayers.captain,
                Player.first_name,
                Player.last_name,
                Player.email,
                Player.phone_number,
                Player.gender,
                Player.active
            )
            .select_from(TeamPlayers)
            .join(Player, TeamPlayers.player_id == Player.id)
            .where(TeamPlayers.team_id == team_id)
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def update_team_player(team_id, player_id, captain):
    engine = create_connection()
    with Session(engine) as session:
        stmt = (
            update(TeamPlayers)
            .where(
                TeamPlayers.team_id == team_id,
                TeamPlayers.player_id == player_id
            )
            .values(captain = captain)
        )
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def delete_team_player(team_id, player_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = (
            delete(TeamPlayers)
            .where(
                TeamPlayers.team_id == team_id,
                TeamPlayers.player_id == player_id
            )
        )
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()