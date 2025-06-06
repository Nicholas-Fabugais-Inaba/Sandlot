from fastapi import APIRouter
from .types import NewPlayer, NewTeam, PlayerLoginData, TeamLoginData
from ..db.queries.game_queries import get_standings
from ..db.queries.team_queries import get_all_teams, get_all_season_teams
from ..db.queries.division_queries import get_division_name_by_division_id, get_division_name_by_team_id



router = APIRouter(tags=["standings"])

# need to add forfeiting functionality
@router.get("/get", response_model=list)
async def get_standings_data():
    # gets standings from query and puts into dict
    games = get_standings()
    games = [dict(row) for row in games]
    # teams_data = get_all_teams()
    teams_data = get_all_season_teams()
    teams = {}

    print(games)
    print(teams_data)

    for team in teams_data:            
        teams[team['id']] = {
            "name": team["team_name"], 
            "wins": 0, 
            "losses": 0, 
            "ties": 0, 
            "forfeits": 0, 
            "differential": 0, 
            "division": team["division_name"]
        }

    for game in games:
        # checking if game has been played and scored
        if game['played'] == True:

            # computing forfeiting
            if game['forfeit'] == 1 or game['forfeit'] == 2:
                if game['home_team_score'] == 9:
                    teams[game['away_team_id']]['forfeits'] += 1
                elif game['away_team_score'] == 9:
                    teams[game['home_team_id']]['forfeits'] += 1

            # computing wins, losses, ties, and differentials
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
    
    return teams.values()
