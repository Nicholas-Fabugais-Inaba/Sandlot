from sqlalchemy.orm import Session
from sqlalchemy import select, delete, update
from ..create_engine import create_connection
from ..models import Waiver, Player, WaiverFormat


def insert_waiver(player_id, signature, initials, year):
    engine = create_connection()
    with Session(engine) as session:
        waiver = Waiver(
            player_id = player_id,
            signature = signature,
            initials = initials,
            year = year
        )
        try:
            session.add_all([waiver])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def insert_waiver_format(year, index, text):
    engine = create_connection()
    with Session(engine) as session:
        waiver_format = WaiverFormat(
            year = year,
            index = index,
            text = text
        )
        try:
            session.add_all([waiver_format])
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
                Waiver.initials,
                Waiver.year
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
                Waiver.initials,
                Waiver.year
            )
            .select_from(Waiver)
            .join(Player, Waiver.player_id == Player.id)
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def get_waiver_format_by_year(year):
    engine = create_connection()
    with Session(engine) as session:
        stmt = (
            select(
                WaiverFormat.id,
                WaiverFormat.year,
                WaiverFormat.index,
                WaiverFormat.text
            )
            .select_from(WaiverFormat)
            .where(year == WaiverFormat.year)
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def delete_waiver_formats_by_year(year):
    engine = create_connection()
    with Session(engine) as session:
        stmt = (
            delete(WaiverFormat)
            .where(WaiverFormat.year == year)
        )
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()