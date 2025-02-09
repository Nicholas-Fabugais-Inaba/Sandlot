from queries import insert_team
from pydantic import BaseModel

class MockTeam(BaseModel):
    team_name: str
    username: str
    password: str
    division: int
    preferred_division: int
    offday: int
    preferred_time: int

tigers = MockTeam(
    team_name="Tigers",
    username="tiger_user",
    password="tiger_pass",
    division=0,
    preferred_division=0,
    offday=0,
    preferred_time=0
)
cardinals = MockTeam(
    team_name="Cardinals",
    username="cardinal_user",
    password="cardinal_pass",
    division=0,
    preferred_division=0,
    offday=2,
    preferred_time=0
)
orioles = MockTeam(
    team_name="Orioles",
    username="oriole_user",
    password="oriole_pass",
    division=0,
    preferred_division=0,
    offday=4,
    preferred_time=0
)
jays = MockTeam(
    team_name="Jays",
    username="jay_user",
    password="jay_pass",
    division=0,
    preferred_division=0,
    offday=2,
    preferred_time=0
)
dodgers = MockTeam(
    team_name="Dodgers",
    username="dodger_user",
    password="dodger_pass",
    division=0,
    preferred_division=0,
    offday=3,
    preferred_time=0
)
rangers = MockTeam(
    team_name="Rangers",
    username="ranger_user",
    password="ranger_pass",
    division=0,
    preferred_division=0,
    offday=1,
    preferred_time=0
)
astros = MockTeam(
    team_name="Astros",
    username="astro_user",
    password="astro_pass",
    division=0,
    preferred_division=0,
    offday=0,
    preferred_time=0
)

# Division A
# tigers = {"name": "Tigers", "offday": 0}
# cardinals = {"name": "Cardinals", "offday": 2}
# orioles = {"name": "Orioles", "offday": 4}
# jays = {"name": "Blue Jays", "offday": 2}
# dodgers = {"name": "Dodgers", "offday": 3}
# rangers = {"name": "Rangers", "offday": 1}
# astros = {"name": "Astros", "offday": 0}

angels = MockTeam(
    team_name="Angels",
    username="angel_user",
    password="angel_pass",
    division=1,
    preferred_division=1,
    offday=4,
    preferred_time=0
)
rockies = MockTeam(
    team_name="Rockies",
    username="rockie_user",
    password="rockie_pass",
    division=1,
    preferred_division=1,
    offday=2,
    preferred_time=0
)
royals = MockTeam(
    team_name="Royals",
    username="royal_user",
    password="royal_pass",
    division=1,
    preferred_division=1,
    offday=0,
    preferred_time=0
)
cubs = MockTeam(
    team_name="Cubs",
    username="cub_user",
    password="cub_pass",
    division=1,
    preferred_division=1,
    offday=3,
    preferred_time=0
)
padres = MockTeam(
    team_name="Padres",
    username="padre_user",
    password="padre_pass",
    division=1,
    preferred_division=1,
    offday=3,
    preferred_time=0
)
white_sox = MockTeam(
    team_name="White Sox",
    username="sox_user",
    password="sox_pass",
    division=1,
    preferred_division=1,
    offday=1,
    preferred_time=0
)
guardians = MockTeam(
    team_name="Guardians",
    username="guardian_user",
    password="guardian_pass",
    division=1,
    preferred_division=1,
    offday=2,
    preferred_time=0
)

# Division B
# angels = {"name": "Angels", "offday": 4}
# rockies = {"name": "Rockies", "offday": 2}
# royals = {"name": "Royals", "offday": 0}
# cubs = {"name": "Cubs", "offday": 3}
# padres = {"name": "Padres", "offday": 3}
# white_sox = {"name": "White Sox", "offday": 1}
# guardians = {"name": "Guardians", "offday": 2}

braves = MockTeam(
    team_name="Braves",
    username="brave_user",
    password="brave_pass",
    division=2,
    preferred_division=2,
    offday=1,
    preferred_time=0
)
giants = MockTeam(
    team_name="Giants",
    username="giant_user",
    password="giant_pass",
    division=2,
    preferred_division=2,
    offday=0,
    preferred_time=0
)
brewers = MockTeam(
    team_name="Brewers",
    username="brewer_user",
    password="brewer_pass",
    division=2,
    preferred_division=2,
    offday=4,
    preferred_time=0
)
nationals = MockTeam(
    team_name="Nationals",
    username="national_user",
    password="national_pass",
    division=2,
    preferred_division=2,
    offday=3,
    preferred_time=0
)
rays = MockTeam(
    team_name="Rays",
    username="ray_user",
    password="ray_pass",
    division=2,
    preferred_division=2,
    offday=4,
    preferred_time=0
)
marlins = MockTeam(
    team_name="Marlins",
    username="marlin_user",
    password="marlin_pass",
    division=2,
    preferred_division=2,
    offday=2,
    preferred_time=0
)
yankees = MockTeam(
    team_name="Yankees",
    username="yankee_user",
    password="yankee_pass",
    division=2,
    preferred_division=2,
    offday=1,
    preferred_time=0
)

# Division C
# braves = {"name": "Braves", "offday": 1}
# giants = {"name": "Giants", "offday": 0}
# brewers = {"name": "Brewers", "offday": 4}
# nationals = {"name": "Nationals", "offday": 3}
# rays = {"name": "Rays", "offday": 4}
# marlins = {"name": "Marlins", "offday": 2}
# yankees = {"name": "Yankees", "offday": 1}

red_sox = MockTeam(
    team_name="Red Sox",
    username="red_sox_user",
    password="red_sox_pass",
    division=3,
    preferred_division=3,
    offday=2,
    preferred_time=0
)
diamondbacks = MockTeam(
    team_name="Diamondbacks",
    username="diamondback_user",
    password="diamondback_pass",
    division=3,
    preferred_division=3,
    offday=3,
    preferred_time=0
)
mets = MockTeam(
    team_name="Mets",
    username="mets_user",
    password="mets_pass",
    division=3,
    preferred_division=3,
    offday=4,
    preferred_time=0
)
reds = MockTeam(
    team_name="Reds",
    username="reds_user",
    password="reds_pass",
    division=3,
    preferred_division=3,
    offday=0,
    preferred_time=0
)
phillies = MockTeam(
    team_name="Phillies",
    username="phillies_user",
    password="phillies_pass",
    division=3,
    preferred_division=3,
    offday=1,
    preferred_time=0
)
pirates = MockTeam( 
    team_name="Pirates",
    username="pirates_user",
    password="pirates_pass",
    division=3,
    preferred_division=3,
    offday=2,
    preferred_time=0
)
mariners = MockTeam(
    team_name="Mariners",
    username="mariner_user",
    password="mariner_pass",
    division=3,
    preferred_division=3,
    offday=3,
    preferred_time=0
)

# Division D
# red_sox = {"name": "Red Sox", "offday": 2}
# diamondbacks = {"name": "Diamondbacks", "offday": 3}
# mets = {"name": "Mets", "offday": 4}
# reds = {"name": "Reds", "offday": 0}
# phillies = {"name": "Phillies", "offday": 1}
# pirates = {"name": "Pirates", "offday": 2}
# mariners = {"name": "Mariners", "offday": 3}

Teams = [tigers, cardinals, orioles, jays, dodgers, rangers, astros, angels, rockies, royals, cubs, padres, white_sox, guardians, braves, giants, brewers, nationals, rays, marlins, yankees, red_sox, diamondbacks, mets, reds, phillies, pirates, mariners]
for team in Teams:
    insert_team(team.team_name, team.username, team.password, team.division, team.preferred_division, team.offday, team.preferred_time)