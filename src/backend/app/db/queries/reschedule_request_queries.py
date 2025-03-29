from sqlalchemy.orm import Session, aliased
from sqlalchemy import select, or_, delete
from ..create_engine import create_connection
from ..models import Team, Game, RescheduleRequest


def insert_reschedule_request(requester_id, receiver_id, game_id, option1, option2, option3, option4, option5, option1_field, option2_field, option3_field, option4_field, option5_field, option1_timeslot, option2_timeslot, option3_timeslot, option4_timeslot, option5_timeslot):
    engine = create_connection()
    with Session(engine) as session:
        request = RescheduleRequest(
            requester_id=requester_id,
            receiver_id=receiver_id,
            game_id=game_id,
            option1=option1,
            option2=option2,
            option3=option3,
            option4=option4,
            option5=option5,
            option1_field=option1_field,
            option2_field=option2_field,
            option3_field=option3_field,
            option4_field=option4_field,
            option5_field=option5_field,
            option1_timeslot=option1_timeslot,
            option2_timeslot=option2_timeslot,
            option3_timeslot=option3_timeslot,
            option4_timeslot=option4_timeslot,
            option5_timeslot=option5_timeslot
        )
        try:
            session.add_all([request])
        except:
            session.rollback()
            raise
        else:
            session.commit()
            return "reschedule request created"

def get_reschedule_requests(team_id):
    engine = create_connection()
    with Session(engine) as session:
        requester_alias = aliased(Team, name="requesting_team")
        reciever_alias = aliased(Team, name="recieving_team")

        stmt = (
            select(
                RescheduleRequest.id,
                RescheduleRequest.game_id,
                RescheduleRequest.option1,
                RescheduleRequest.option1_field,
                RescheduleRequest.option1_timeslot,
                RescheduleRequest.option2,
                RescheduleRequest.option2_field,
                RescheduleRequest.option2_timeslot,
                RescheduleRequest.option3,
                RescheduleRequest.option3_field,
                RescheduleRequest.option3_timeslot,
                RescheduleRequest.option4,
                RescheduleRequest.option4_field,
                RescheduleRequest.option4_timeslot,
                RescheduleRequest.option5,
                RescheduleRequest.option5_field,
                RescheduleRequest.option5_timeslot,
                requester_alias.id.label("requester_id"),
                requester_alias.team_name.label("requester_team_name"),
                reciever_alias.id.label("reciever_id"),
                reciever_alias.team_name.label("reciever_team_name"),
                Game.date,
                Game.time,
                Game.field
            )
            .select_from(RescheduleRequest)
            .join(requester_alias, RescheduleRequest.requester_id == requester_alias.id)
            .join(reciever_alias, RescheduleRequest.receiver_id == reciever_alias.id)
            .join(Game, Game.id == RescheduleRequest.game_id)
            .where(or_(requester_alias.id == team_id, reciever_alias.id == team_id))
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def delete_reschedule_request(request_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = delete(RescheduleRequest).where(RescheduleRequest.id == request_id)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
        return "reschedule request deleted"
    
def delete_all_reschedule_requests():
    engine = create_connection()
    with Session(engine) as session:
        try:
            session.query(RescheduleRequest).delete()
        except:
            session.rollback()
            raise
        else:
            session.commit()