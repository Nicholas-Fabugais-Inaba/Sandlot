import pytest
import sys

sys.path.append('C:\\Users\\casra\\Documents\\VScode Projects\\4G06_Capstone\\src')

from backend.app.routers.user_router import *
from backend.app.routers.types import NewPlayer, NewTeam
from backend.app.db.queries import delete_player, delete_team

@pytest.mark.asyncio
async def test_create_player_account():
    response = await create_player_account(
        NewPlayer(
            name="test_name",
            email="test_email",
            password="test_password"
        )   
    )
    assert(response == "player created")

@pytest.mark.asyncio
async def test_create_team_account():
    response = await create_team_account(
        NewTeam(
            team_name = "test_team_name",
            username = "test_username",
            password = "test_password",
            preferred_division = 0,
            preferred_offday = 0,
            preferred_time = 0,
        )   
    )
    assert(response == "team created")

player_id = None
team_id = None

@pytest.mark.asyncio
async def test_get_player_account():
    response = await get_player_account(
        PlayerLoginData(
            email = "test_email"
        )
    )
    global player_id
    player_id = response['id']
    player = {'id': player_id, 'first_name': 'test_name', 'last_name': None, 'email': 'test_email', 'password': 'test_password', 'phone_number': None, 'gender': None, 'team_id': None, 'is_commissioner': False}
    assert(response == player)

@pytest.mark.asyncio
async def test_get_team_account():
    response = await get_team_account(
        TeamLoginData(
            username = "test_username"
        )
    )
    global team_id
    team_id = response['id']
    team = {'id': team_id, 'team_name': 'test_team_name', 'username': 'test_username', 'password': 'test_password', 'division': 0, 'offday': 0, 'preferred_division': 0, 'preferred_time': 0}
    assert(response == team)

@pytest.mark.asyncio
async def test_delete_player():
    global player_id
    response = delete_player(player_id)
    assert(response == "player deleted")

@pytest.mark.asyncio
async def test_delete_team():
    global team_id
    response = delete_team(team_id)
    assert(response == "team deleted")