import pytest
import sys

sys.path.append('src')

from backend.app.routers.team_router import *
from backend.app.routers.types import TeamID

@pytest.mark.asyncio
async def test_get_player_data():
    response = await get_player_data(TeamID(team_id=1))
    players = [{'id': 2, 'first_name': 'Ethan', 'last_name': 'Winslow', 'email': 'ethan.winslow@email.com', 'phone_number': '(312)-555-0198', 'gender': 'Male'}]
    assert(response == players)

@pytest.mark.asyncio
async def test_get_team_data():
    response = await get_team_data()
    teams = [
        {'id': 1, 'name': 'Tigers', 'division': 'Division A'}, 
        {'id': 2, 'name': 'Cardinals', 'division': 'Division A'}, 
        {'id': 3, 'name': 'Orioles', 'division': 'Division A'}, 
        {'id': 4, 'name': 'Jays', 'division': 'Division A'}, 
        {'id': 5, 'name': 'Dodgers', 'division': 'Division A'}, 
        {'id': 6, 'name': 'Rangers', 'division': 'Division A'}, 
        {'id': 7, 'name': 'Astros', 'division': 'Division A'}, 
        {'id': 8, 'name': 'Angels', 'division': 'Division B'}, 
        {'id': 9, 'name': 'Rockies', 'division': 'Division B'}, 
        {'id': 10, 'name': 'Royals', 'division': 'Division B'}, 
        {'id': 11, 'name': 'Cubs', 'division': 'Division B'}, 
        {'id': 12, 'name': 'Padres', 'division': 'Division B'}, 
        {'id': 13, 'name': 'White Sox', 'division': 'Division B'}, 
        {'id': 14, 'name': 'Guardians', 'division': 'Division B'}, 
        {'id': 15, 'name': 'Braves', 'division': 'Division C'}, 
        {'id': 16, 'name': 'Giants', 'division': 'Division C'}, 
        {'id': 17, 'name': 'Brewers', 'division': 'Division C'}, 
        {'id': 18, 'name': 'Nationals', 'division': 'Division C'}, 
        {'id': 19, 'name': 'Rays', 'division': 'Division C'}, 
        {'id': 20, 'name': 'Marlins', 'division': 'Division C'}, 
        {'id': 21, 'name': 'Yankees', 'division': 'Division C'}, 
        {'id': 22, 'name': 'Red Sox', 'division': 'Division D'}, 
        {'id': 23, 'name': 'Diamondbacks', 'division': 'Division D'}, 
        {'id': 24, 'name': 'Mets', 'division': 'Division D'}, 
        {'id': 25, 'name': 'Reds', 'division': 'Division D'}, 
        {'id': 26, 'name': 'Phillies', 'division': 'Division D'}, 
        {'id': 27, 'name': 'Pirates', 'division': 'Division D'}, 
        {'id': 28, 'name': 'Mariners', 'division': 'Division D'}]
    assert(list(response) == teams)