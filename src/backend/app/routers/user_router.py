from fastapi import APIRouter
from .types import NewPlayer, NewTeam, PlayerLoginData, TeamLoginData, UpdatePassword, UpdateEmail, UpdateName, UpdateActiveTeam, PlayerID, TeamID
from ..db.queries.player_queries import insert_player, get_player, get_player_active_team, update_player_password, update_player_email, update_player_name, update_player_active_team, get_player_account_data
from ..db.queries.team_queries import insert_team, get_team, get_team_account_data
from ..db.queries.team_players_queries import get_players_teams


router = APIRouter(tags=["user"])

@router.post("/create_player", response_model=None)
async def create_player_account(newPlayer: NewPlayer):
    response = insert_player(newPlayer.first_name, newPlayer.last_name, newPlayer.email, newPlayer.password, newPlayer.gender)
    return response

@router.post("/create_team", response_model=None)
async def create_team_account(newTeam: NewTeam):
    # response = insert_team(newTeam.team_name, newTeam.username, newTeam.password, newTeam.preferred_division, newTeam.preferred_offday, newTeam.preferred_time)
    response = insert_team(newTeam.team_name, newTeam.username, newTeam.password, newTeam.preferred_division, newTeam.preferred_division, newTeam.preferred_offday, newTeam.preferred_time)
    return response

@router.post("/get_player", response_model=object)
async def get_player_account(data: PlayerLoginData):
    # get player info
    player = dict(get_player(data.email))
    # get list of teams player has joined
    player_teams = get_players_teams(player["id"])
    # convert list of dicts to a single dict with ids as keys and names as values
    player_teams_dict = {team["team_id"]: team["team_name"] for team in player_teams}
    # add a key to the existing player dict to store the dict of teams
    player["teams"] = player_teams_dict
    # Set the player's teamId to the first team id in the teams dict
    player["team_id"] = next(iter(player_teams_dict), None)
    return player

@router.post("/get_player_account_data", response_model=object)
async def get_player_account_data_route(data: PlayerID):
    player_data = dict(get_player_account_data(data.player_id))
    # get list of teams player has joined
    player_teams = get_players_teams(data.player_id)
    # convert list of dicts to a single dict with ids as keys and names as values
    player_teams_dict = {team["team_id"]: team["team_name"] for team in player_teams}
    # add a key to the existing player dict to store the dict of teams
    player_data["teams"] = player_teams_dict
    return player_data

@router.post("/get_team", response_model=object)
async def get_team_account(data: TeamLoginData):
    response = dict(get_team(data.username))
    return response

@router.post("/get_team_account_data", response_model=object)
async def get_team_account_data_route(data: TeamID):
    response = dict(get_team_account_data(data.team_id))
    return response

@router.post("/get_player_active_team", response_model=dict)
async def get_player_active_team_route(data: PlayerID):
    response = get_player_active_team(data.player_id)
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

@router.put("/update_player_active_team", response_model=None)
async def update_player_active_team_route(data: UpdateActiveTeam):
    response = update_player_active_team(data.player_id, data.team_id)
    return response
