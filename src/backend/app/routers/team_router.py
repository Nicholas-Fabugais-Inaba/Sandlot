from fastapi import APIRouter
from ..db.queries import get_all_teams, get_team_info_by_current_user
from .types import TeamID

router = APIRouter(tags=["team"])

@router.post("/get_players", response_model=list)
async def get_player_data(data: TeamID):
    players_on_team = get_team_info_by_current_user(data.team_id)
    players_on_team = [dict(row) for row in players_on_team]
    return players_on_team

@router.get("/get_teams", response_model=list)
async def get_team_data():

    teams = get_all_teams() # select(Team.id, Team.team_name, Team.division, Team.offday)
    teams = {team['id']: {"id": team["id"], "name": team["team_name"], "division": map_division(team["division"])} for team in teams}

    return teams.values()

# need to put into helper function file and use from there instead of repeating code with standings
def map_division(divison_int):
    if divison_int == 0:
        return "Division A"
    elif divison_int == 1:
        return "Division B"
    elif divison_int == 2:
        return "Division C"
    elif divison_int == 3:
        return "Division D"
    else:
        return "Unknown"