from fastapi import APIRouter
from .types import TeamID
from db.queries.team_queries import get_all_teams, get_team_players
from db.queries.division_queries import get_division_name_by_division_id


router = APIRouter(tags=["team"])

@router.post("/get_players", response_model=list)
async def get_player_data(data: TeamID):
    players_on_team = get_team_players(data.team_id)
    players_on_team = [dict(row) for row in players_on_team]
    return players_on_team

@router.get("/get_teams", response_model=list)
async def get_team_data():

    teams = get_all_teams() # select(Team.id, Team.team_name, Team.division, Team.offday)
    teams = {team['id']: {"id": team["id"], "name": team["team_name"], "division": get_division_name_by_division_id(team["division"])["division_name"]} for team in teams}

    return teams.values()
