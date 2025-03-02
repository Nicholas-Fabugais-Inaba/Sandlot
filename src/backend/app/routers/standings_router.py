from fastapi import APIRouter
from ..db.queries import get_standings, get_all_teams
from .types import NewPlayer, NewTeam, PlayerLoginData, TeamLoginData


router = APIRouter(tags=["standings"])

# need to add forfeiting functionality
@router.get("/get", response_model=list)
async def get_standings_data():
    print("MYOUTPUT")
    # gets standings from query and puts into dict
    games = get_standings()
    games = [dict(row) for row in games]
    print("MYOUTPUTgetstandings")
    teams = get_all_teams()
    teams = {team['id']: {"name": team["team_name"], "wins": 0, "losses": 0, "ties": 0, "forfeits": 0, "differential": 0, "division": map_division(team["division"])} for team in teams}
    print("MYOUTPUTgetteams")
    for game in games:
        if game['home_team_score'] > game['away_team_score']:
            teams[game['home_team_id']]['wins'] += 1
            teams[game['away_team_id']]['losses'] += 1
        elif game['home_team_score'] < game['away_team_score']:
            teams[game['home_team_id']]['losses'] += 1
            teams[game['away_team_id']]['wins'] += 1
        else:
            teams[game['home_team_id']]['ties'] += 1
            teams[game['away_team_id']]['ties'] += 1

        teams[game['home_team_id']]['differential'] += game['home_team_score'] - game['away_team_score']
        teams[game['away_team_id']]['differential'] += game['away_team_score'] - game['home_team_score']
    
        # forfeits ommitted for now
    print("MYOUTPUT")
    print(teams.values())
    return teams.values()

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