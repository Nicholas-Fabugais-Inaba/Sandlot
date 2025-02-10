from fastapi import APIRouter
from ..functions.gen_sched_input import create_schedule
from ..db.queries import get_all_games, get_team_games, insert_reschedule_request, get_reschedule_requests, delete_reschedule_request, update_game
from .types import RescheduleRequest, TeamID, RRAccept


router = APIRouter(tags=["schedule"])

# temporary types and function
@router.get("/get", response_model=list)
async def get_schedule():
    # we would call the helper functions to generate the schedule here and return the output back to the website
    schedule: list = create_schedule()
    return schedule

@router.get("/get_all_games", response_model=list)
async def get_scheduled_games():
    games = get_all_games()
    games = [dict(row) for row in games]
    return games

@router.post("/get_team_games", response_model=list)
async def team_games(data: TeamID):
    games = get_team_games(data.team_id)
    games = [dict(row) for row in games]
    return games

@router.post("/create_reschedule_request", response_model=None)
async def create_RR(request: RescheduleRequest):
    response = insert_reschedule_request(request.requester_id, request.receiver_id, request.game_id, request.option1, request.option2, request.option3, request.option4, request.option5, request.option1_field, request.option2_field, request.option3_field, request.option4_field, request.option5_field)
    return response

@router.post("/get_reschedule_requests", response_model=list)
async def get_team_RRs(data: TeamID):
    requests = get_reschedule_requests(data.team_id)
    requests = [dict(row) for row in requests]
    return requests

@router.post("/reschedule_request_accepted", response_model=None)
async def RR_accepted(data: RRAccept):
    delete_reschedule_request(data.rr_id)
    update_game(data.old_game_id, data.date, data.time, data.field)
    return True