from fastapi import APIRouter
from .types import TeamID
from ..db.queries.team_queries import get_all_season_teams, get_team_players

router = APIRouter(tags=["directory"])

@router.post("/get_teams", response_model=list)
async def get_directory_teams():
    teams_data = get_all_season_teams()
    teams = {}

    for team in teams_data:            
        teams[team['id']] = {
            "team_id": team["id"],
            "name": team["team_name"], 
            "division": team["division_name"],
        }
    
    return teams.values()

@router.post("/get_players_in_team", response_model=list)
async def get_directory_players(team_id: TeamID):
    players_data = get_team_players(team_id)
    players_data = {}

    for player in players_data:            
        players_data[player['id']] = {
            "player_id": player["id"],
            "first_name": player["first_name"], 
            "last_name": player["last_name"], 
            "email": player["email"],
            "phone_number": player["phone_number"],
            "gender": player["gender"]
        }
    
    print("THIS IS THE PLAYERS_DATA:", players_data)
    print("THIS IS THE PLAYERS_DATA.VALUES():", players_data.values())
    return players_data.values()