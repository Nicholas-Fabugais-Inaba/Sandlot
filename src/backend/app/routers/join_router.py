from fastapi import APIRouter
from .types import JoinRequest, TeamID, PlayerEmail, JRAccept, JRDecline
from ..db.queries.join_request_queries import insert_join_request, get_join_requests, get_join_requests_by_player, decline_join_request, delete_join_request
from ..db.queries.player_queries import get_player, update_players_team


router = APIRouter(tags=["join"])

# TODO: fix this route
@router.post("/create_join_request", response_model=None)
async def create_join_request(data: JoinRequest):
    player = get_player(data.email)
    response = insert_join_request(player.id, data.team_id)
    return response

@router.post("/get_join_requests", response_model=list)
async def get_team_join_requests(data: TeamID):
    requests = get_join_requests(data.team_id)
    requests = [dict(row) for row in requests]
    return requests

@router.post("/get_join_requests_by_player", response_model=list)
async def get_team_join_requests_by_player_route(data: PlayerEmail):
    player = get_player(data.email)
    requests = get_join_requests_by_player(player.id)
    requests = [dict(row) for row in requests]
    return requests

@router.post("/join_request_accepted", response_model=None)
async def join_request_accepted(data: JRAccept):
    delete_join_request(data.jr_id)
    update_players_team(data.player_id, data.team_id)
    return True

@router.post("/join_request_declined", response_model=None)
async def join_request_declined(data: JRDecline):
    decline_join_request(data.jr_id)
    return True