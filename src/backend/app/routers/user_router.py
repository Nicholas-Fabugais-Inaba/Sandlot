from fastapi import APIRouter
from .types import NewPlayer, NewTeam, PlayerLoginData, TeamLoginData, UpdatePassword, UpdateEmail, UpdateName
from ..db.queries.player_queries import insert_player, get_player, update_player_password, update_player_email, update_player_name
from ..db.queries.team_queries import insert_team, get_team


router = APIRouter(tags=["user"])

# TODO: temporary response_model
@router.post("/create_player", response_model=None)
async def create_player_account(newPlayer: NewPlayer):
    response = insert_player(newPlayer.name, newPlayer.email, newPlayer.password)
    return response

@router.post("/create_team", response_model=None)
async def create_team_account(newTeam: NewTeam):
    # response = insert_team(newTeam.team_name, newTeam.username, newTeam.password, newTeam.preferred_division, newTeam.preferred_offday, newTeam.preferred_time)
    response = insert_team(newTeam.team_name, newTeam.username, newTeam.password, newTeam.preferred_division, newTeam.preferred_division, newTeam.preferred_offday, newTeam.preferred_time)
    return response

@router.post("/get_player", response_model=object)
async def get_player_account(data: PlayerLoginData):
    response = dict(get_player(data.email))
    return response

@router.post("/get_team", response_model=object)
async def get_team_account(data: TeamLoginData):
    response = dict(get_team(data.username))
    return response


@router.put("/update_player_password", response_model=None)
async def update_player_password_route(data: UpdatePassword):
    response = update_player_password(data.player_id, data.new_password)
    return response

@router.put("/update_player_email", response_model=None)
async def update_player_email_route(data: UpdateEmail):
    response = update_player_email(data.player_id, data.new_email)
    return response

@router.put("/update_player_name", response_model=None)
async def update_player_name_route(data: UpdateName):
    response = update_player_name(data.player_id, data.first_name, data.last_name)
    return response
