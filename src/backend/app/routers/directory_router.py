from fastapi import APIRouter
from .types import NewPlayer, NewTeam, PlayerLoginData, TeamLoginData
from ..db.queries.game_queries import get_standings
from ..db.queries.team_queries import get_all_season_teams
from ..db.queries.division_queries import get_division_name_by_division_id



router = APIRouter(tags=["directory"])

# need to add forfeiting functionality
@router.get("/get", response_model=list)
async def get_standings_data():
    print("Entering directory_router")
    # gets standings from query and puts into dict
    games = get_standings()
    games = [dict(row) for row in games]
    teams_data = get_all_season_teams()
    teams = {}
    print("TEAMS DATA IS: ", teams_data)

    for team in teams_data:            
        teams[team['id']] = {
            "name": team["team_name"], 
            # "division": get_division_name_by_division_id(team["division"])["division_name"]
            "division": team["division_name"],

        }
    
    return teams.values()
