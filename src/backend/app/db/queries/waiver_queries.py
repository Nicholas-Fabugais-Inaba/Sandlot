from sqlalchemy.orm import Session
from sqlalchemy import select, delete, update
from ..create_engine import create_connection
from ..models import Waiver, Player


def insert_waiver(player_id, signature, date):
    engine = create_connection()
    with Session(engine) as session:
        waiver = Waiver(
            player_id = player_id,
            signature = signature,
            date = date
        )
        try:
            session.add_all([waiver])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_player_waivers(player_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = (
            select(
                Waiver.id,
                Waiver.player_id,
                Waiver.signature,
                Waiver.date
            )
            .where(Waiver.player_id == player_id)
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def get_all_waivers():
    engine = create_connection()
    with Session(engine) as session:
        stmt = (
            select(
                Waiver.id,
                Waiver.player_id,
                Player.first_name,
                Player.last_name,
                Waiver.signature,
                Waiver.date
            )
            .select_from(Waiver)
            .join(Player, Waiver.player_id == Player.id)
        )
        result = session.execute(stmt).mappings().all()
        return result