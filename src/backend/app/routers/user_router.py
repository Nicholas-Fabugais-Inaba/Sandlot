from fastapi import APIRouter
from .types import NewPlayer, NewTeam, PlayerLoginData, TeamLoginData
from db.queries.player_queries import insert_player, get_player
from db.queries.team_queries import insert_team, get_team


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