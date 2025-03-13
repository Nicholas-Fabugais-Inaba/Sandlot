import pytest
import sys

sys.path.append('src')

from backend.app.routers.standings_router import *

@pytest.mark.asyncio
async def test_get_standings_data():
    response = await get_standings_data()
    standings = [
        {'name': 'Tigers', 'wins': 4, 'losses': 4, 'ties': 13, 'forfeits': 0, 'differential': -1, 'division': 'Division A'}, 
        {'name': 'Cardinals', 'wins': 4, 'losses': 6, 'ties': 11, 'forfeits': 0, 'differential': -9, 'division': 'Division A'}, 
        {'name': 'Orioles', 'wins': 4, 'losses': 2, 'ties': 16, 'forfeits': 0, 'differential': 2, 'division': 'Division A'}, 
        {'name': 'Jays', 'wins': 3, 'losses': 3, 'ties': 15, 'forfeits': 0, 'differential': 1, 'division': 'Division A'}, 
        {'name': 'Dodgers', 'wins': 9, 'losses': 4, 'ties': 9, 'forfeits': 0, 'differential': 20, 'division': 'Division A'}, 
        {'name': 'Rangers', 'wins': 4, 'losses': 5, 'ties': 12, 'forfeits': 0, 'differential': 2, 'division': 'Division A'}, 
        {'name': 'Astros', 'wins': 4, 'losses': 8, 'ties': 10, 'forfeits': 0, 'differential': -15, 'division': 'Division A'}, 
        {'name': 'Angels', 'wins': 5, 'losses': 4, 'ties': 12, 'forfeits': 0, 'differential': 4, 'division': 'Division B'}, 
        {'name': 'Rockies', 'wins': 5, 'losses': 2, 'ties': 14, 'forfeits': 0, 'differential': 9, 'division': 'Division B'}, 
        {'name': 'Royals', 'wins': 5, 'losses': 6, 'ties': 11, 'forfeits': 0, 'differential': 0, 'division': 'Division B'}, 
        {'name': 'Cubs', 'wins': 6, 'losses': 5, 'ties': 10, 'forfeits': 0, 'differential': -5, 'division': 'Division B'}, 
        {'name': 'Padres', 'wins': 4, 'losses': 5, 'ties': 13, 'forfeits': 0, 'differential': -5, 'division': 'Division B'}, 
        {'name': 'White Sox', 'wins': 5, 'losses': 7, 'ties': 9, 'forfeits': 0, 'differential': -6, 'division': 'Division B'}, 
        {'name': 'Guardians', 'wins': 4, 'losses': 5, 'ties': 13, 'forfeits': 0, 'differential': 3, 'division': 'Division B'}, 
        {'name': 'Braves', 'wins': 2, 'losses': 3, 'ties': 16, 'forfeits': 0, 'differential': 1, 'division': 'Division C'}, 
        {'name': 'Giants', 'wins': 2, 'losses': 2, 'ties': 17, 'forfeits': 0, 'differential': -3, 'division': 'Division C'}, 
        {'name': 'Brewers', 'wins': 4, 'losses': 5, 'ties': 13, 'forfeits': 0, 'differential': -3, 'division': 'Division C'}, 
        {'name': 'Nationals', 'wins': 8, 'losses': 3, 'ties': 10, 'forfeits': 0, 'differential': 14, 'division': 'Division C'}, 
        {'name': 'Rays', 'wins': 4, 'losses': 6, 'ties': 12, 'forfeits': 0, 'differential': -8, 'division': 'Division C'}, 
        {'name': 'Marlins', 'wins': 3, 'losses': 3, 'ties': 15, 'forfeits': 0, 'differential': 4, 'division': 'Division C'}, 
        {'name': 'Yankees', 'wins': 3, 'losses': 4, 'ties': 15, 'forfeits': 0, 'differential': -5, 'division': 'Division C'}, 
        {'name': 'Red Sox', 'wins': 3, 'losses': 4, 'ties': 14, 'forfeits': 0, 'differential': -4, 'division': 'Division D'}, 
        {'name': 'Diamondbacks', 'wins': 4, 'losses': 2, 'ties': 15, 'forfeits': 0, 'differential': 11, 'division': 'Division D'}, 
        {'name': 'Mets', 'wins': 6, 'losses': 4, 'ties': 12, 'forfeits': 0, 'differential': -2, 'division': 'Division D'}, 
        {'name': 'Reds', 'wins': 2, 'losses': 7, 'ties': 12, 'forfeits': 0, 'differential': -9, 'division': 'Division D'}, 
        {'name': 'Phillies', 'wins': 5, 'losses': 4, 'ties': 13, 'forfeits': 0, 'differential': 1, 'division': 'Division D'}, 
        {'name': 'Pirates', 'wins': 5, 'losses': 2, 'ties': 14, 'forfeits': 0, 'differential': 9, 'division': 'Division D'}, 
        {'name': 'Mariners', 'wins': 2, 'losses': 4, 'ties': 16, 'forfeits': 0, 'differential': -6, 'division': 'Division D'}
    ]
    assert(list(response) == standings)