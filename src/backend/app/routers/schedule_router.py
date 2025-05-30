from fastapi import APIRouter
from .types import RescheduleRequest, TeamID, GameID, RRAccept, RRDeny, SchedParams, ScoreData, CommissionerReschedule
from ..db.queries.game_queries import get_all_games, get_team_games, update_game, delete_all_games, get_score, update_score
from ..db.queries.reschedule_request_queries import insert_reschedule_request, get_reschedule_requests, delete_reschedule_request, delete_all_reschedule_requests
from ..db.queries.timeslot_queries import get_all_timeslots
from ..db.queries.season_settings_queries import get_solstice_settings
from ..functions.gen_sched_input import gen_schedule_repeated

router = APIRouter(tags=["schedule"])

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
    response = insert_reschedule_request(request.requester_id, request.receiver_id, request.game_id, request.option1, request.option2, request.option3, request.option4, request.option5, request.option1_field, request.option2_field, request.option3_field, request.option4_field, request.option5_field, request.option1_timeslot, request.option2_timeslot, request.option3_timeslot, request.option4_timeslot, request.option5_timeslot)
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

@router.post("/reschedule_request_denied", response_model=None)
async def RR_denied(data: RRDeny):
    # Remove reschedule request from the database
    delete_reschedule_request(data.rr_id)
    return True

@router.post("/gen_schedule", response_model=object)
async def gen_schedule(data: SchedParams):
    # delete existing schedule when generating new one
    # TODO: need to delete all reschedule requests as well (also join requests evenutually)
    # delete_all_reschedule_requests()
    # delete_all_games()
    schedule, score, teams = gen_schedule_repeated()
    return {"schedule": schedule, "score": score, "teams": teams}   

@router.post("/submit_schedule", response_model=None)
async def submit_schedule(data: dict):
    # submit_schedule(data)
    return True

@router.post("/get_score", response_model=None)
async def get_game_score(data: GameID):
    score = get_score(data.game_id)
    return score

@router.post("/submit_score", response_model=None)
async def submit_game_score(data: ScoreData):
    update_score(game_id=data.game_id, home_team_score=data.home_score, away_team_score=data.away_score, forfeit=data.forfeit)
    return True

@router.post("/commissioner_reschedule", response_model=None)
async def commissioner_reschedule_route(data: CommissionerReschedule):
    update_game(data.game_id, data.date, data.time, data.field)
    return True

@router.get("/get_all_timeslots", response_model=list)
async def get_all_timeslots_route():
    timeslots = get_all_timeslots()
    timeslots = [dict(row) for row in timeslots]
    return timeslots

@router.get("/get_solstice_settings", response_model=object)
async def get_solstice_settings_route():
    solstice_settings = dict(get_solstice_settings())
    return solstice_settings
