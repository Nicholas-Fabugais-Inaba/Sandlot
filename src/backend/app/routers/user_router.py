from fastapi import APIRouter
from ..db.queries import insert_player, insert_team
from .types import user, team


router = APIRouter(tags=["user"])

# TODO: temporary response_model
@router.post("/create_player", response_model=None)
async def create_player_account(newUser: user):
    response = insert_player(newUser.name, newUser.email, newUser.password)
    return response

@router.post("/create_team", response_model=None)
async def create_team_account(newTeam: team):
    response = insert_team(newTeam.team_name, newTeam.username, newTeam.password, newTeam.preferred_division, newTeam.preferred_offday, newTeam.preferred_time)
    return response