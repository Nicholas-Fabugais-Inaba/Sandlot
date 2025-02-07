from fastapi import APIRouter
from ..db.queries import insert_player, insert_team, get_credentials
from .types import NewUser, NewTeam, sendData


router = APIRouter(tags=["user"])

# TODO: temporary response_model
@router.post("/create_player", response_model=None)
async def create_player_account(newUser: NewUser):
    response = insert_player(newUser.name, newUser.email, newUser.password)
    return response

@router.post("/create_team", response_model=None)
async def create_team_account(newTeam: NewTeam):
    response = insert_team(newTeam.team_name, newTeam.username, newTeam.password, newTeam.preferred_division, newTeam.preferred_offday, newTeam.preferred_time)
    return response

@router.post("/login", response_model=object)
async def get_account_credentials(data: sendData):
    print(data.email)
    response = get_credentials(data.email)
    if(response):
        print(response)
        return response