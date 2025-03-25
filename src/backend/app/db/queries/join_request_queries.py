from sqlalchemy.orm import Session
from sqlalchemy import select, delete, update
from ..create_engine import create_connection
from ..models import Player, JoinRequest, Team


def insert_join_request(player_id, team_id):
    engine = create_connection()
    with Session(engine) as session:
        # Check if a join request already exists for the player and team
        existing_request = session.execute(
            select(JoinRequest).where(
                JoinRequest.player_id == player_id,
                JoinRequest.team_id == team_id,
                JoinRequest.accepted == None
            )
        ).first()

        if existing_request:
            return False  # Join request already exists

        request = JoinRequest(
            player_id=player_id,
            team_id=team_id
        )
        try:
            session.add_all([request])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_join_requests(team_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = (
            select(
                JoinRequest.id,
                Player.id.label("player_id"),
                Player.first_name,
                Player.last_name,
                Player.email,
                Player.phone_number,
                Player.gender
            )
            .select_from(JoinRequest)
            .join(Player, JoinRequest.player_id == Player.id)
            .where(
                JoinRequest.team_id == team_id,
                JoinRequest.accepted == None
            )
        )
        result = session.execute(stmt).mappings().all()
        return result

def get_join_requests_by_player(player_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = (
            select(
                JoinRequest.id,
                JoinRequest.accepted,
                Team.team_name
            )
            .select_from(JoinRequest)
            .join(Team, JoinRequest.team_id == Team.id)
            .where(
                JoinRequest.player_id == player_id,
            )
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def decline_join_request(request_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(JoinRequest).where(JoinRequest.id == request_id).values(accepted=False)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True
    
def delete_join_request(request_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = delete(JoinRequest).where(JoinRequest.id == request_id)
        session.execute(stmt)
        session.commit()