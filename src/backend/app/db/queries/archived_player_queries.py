from sqlalchemy.orm import Session
from sqlalchemy import select
from ..create_engine import create_connection
from ..models import ArchivedPlayer


def insert_archived_player(archived_team_id, first_name, last_name):
    engine = create_connection()
    with Session(engine) as session:
        player = ArchivedPlayer(
            archived_team_id = archived_team_id,
            first_name = first_name,
            last_name = last_name
        )
        try:
            session.add_all([player])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_archived_players_by_team(archived_team_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = (
            select(
                ArchivedPlayer.id,
                ArchivedPlayer.archived_team_id,
                ArchivedPlayer.first_name,
                ArchivedPlayer.last_name,
            )
            .where(ArchivedPlayer.archived_team_id == archived_team_id)
        )
        result = session.execute(stmt).mappings().all()
        return result