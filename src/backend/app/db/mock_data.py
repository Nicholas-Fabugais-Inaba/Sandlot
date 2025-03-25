from pydantic import BaseModel
from ..db.queries.team_queries import insert_team
from ..db.queries.mock_queries import insert_mock_player
from ..db.queries.division_queries import insert_division_with_id
from ..db.queries.season_settings_queries import insert_season_settings


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

# Division A ^

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

# Division B ^

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

# Division C ^

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
    division=0,
    preferred_division=3,
    offday=2,
    preferred_time=0
)
mariners = MockTeam(
    team_name="Mariners",
    username="mariner_user",
    password="mariner_pass",
    division=-1,
    preferred_division=3,
    offday=3,
    preferred_time=0
)

# Division D ^

class MockPlayer(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    phone_number: str
    gender: str
    team_id: int

mock_players = [
    MockPlayer(first_name="Ethan", last_name="Winslow", email="ethan.winslow@email.com", password="Pass123!", phone_number="(312)-555-0198", gender="Male", team_id=1),
    MockPlayer(first_name="Lily", last_name="Thornton", email="lily.thornton@email.com", password="SecurePass1", phone_number="(415)-555-0274", gender="Female", team_id=1),
    MockPlayer(first_name="Noah", last_name="Prescott", email="noah.prescott@email.com", password="Pass456!", phone_number="(646)-555-0932", gender="Male", team_id=1),
    MockPlayer(first_name="Olivia", last_name="Vance", email="olivia.vance@email.com", password="StrongPass2", phone_number="(213)-555-0347", gender="Female", team_id=1),
    MockPlayer(first_name="Mason", last_name="Whitaker", email="mason.whitaker@email.com", password="P@ssword789", phone_number="(702)-555-0183", gender="Male", team_id=1),
    MockPlayer(first_name="Emma", last_name="Callahan", email="emma.callahan@email.com", password="EmmaPass3", phone_number="(503)-555-0761", gender="Female", team_id=1),
    MockPlayer(first_name="Caleb", last_name="Monroe", email="caleb.monroe@email.com", password="Caleb!Pass4", phone_number="(917)-555-0455", gender="Male", team_id=1),
    MockPlayer(first_name="Isabella", last_name="Tate", email="isabella.tate@email.com", password="IsaB3lla99", phone_number="(305)-555-0678", gender="Female", team_id=2),
    MockPlayer(first_name="Dylan", last_name="Mercer", email="dylan.mercer@email.com", password="Merc3rD!", phone_number="(720)-555-0931", gender="Male", team_id=2),
    MockPlayer(first_name="Harper", last_name="Ellington", email="harper.ellington@email.com", password="H@rp34r", phone_number="(404)-555-0823", gender="Female", team_id=2),
    MockPlayer(first_name="Logan", last_name="Ashford", email="logan.ashford@email.com", password="Ashf0rd77", phone_number="(714)-555-0376", gender="Male", team_id=2),
    MockPlayer(first_name="Charlotte", last_name="Hastings", email="charlotte.hastings@email.com", password="Charlott3!", phone_number="(312)-555-0412", gender="Female", team_id=2),
    MockPlayer(first_name="Owen", last_name="Lockwood", email="owen.lockwood@email.com", password="L0ckW00d@", phone_number="(206)-555-0599", gender="Male", team_id=2),
    MockPlayer(first_name="Amelia", last_name="Redford", email="amelia.redford@email.com", password="RedfordA1", phone_number="(646)-555-0724", gender="Female", team_id=2),
    MockPlayer(first_name="Henry", last_name="Sinclair", email="henry.sinclair@email.com", password="SinclairH2", phone_number="(503)-555-0957", gender="Male", team_id=3),
    MockPlayer(first_name="Evelyn", last_name="Carlisle", email="evelyn.carlisle@email.com", password="CarlisleE3", phone_number="(213)-555-0482", gender="Female", team_id=3),
    MockPlayer(first_name="Chase", last_name="Harrington", email="chase.harrington@email.com", password="HarringtonC4", phone_number="(415)-555-0294", gender="Male", team_id=3),
    MockPlayer(first_name="Scarlett", last_name="Winslow", email="scarlett.winslow@email.com", password="WinslowS5", phone_number="(702)-555-0836", gender="Female", team_id=3),
    MockPlayer(first_name="Nathaniel", last_name="Fletcher", email="nathaniel.fletcher@email.com", password="FletcherN6", phone_number="(917)-555-0143", gender="Male", team_id=3),
    MockPlayer(first_name="Grace", last_name="Ellsworth", email="grace.ellsworth@email.com", password="EllsworthG7", phone_number="(305)-555-0921", gender="Female", team_id=3),
    MockPlayer(first_name="Carter", last_name="Hollis", email="carter.hollis@email.com", password="HollisC8", phone_number="(312)-555-0549", gender="Male", team_id=3),
    MockPlayer(first_name="Madison", last_name="Fairchild", email="madison.fairchild@email.com", password="FairchildM9", phone_number="(720)-555-0175", gender="Female", team_id=4),
    MockPlayer(first_name="Blake", last_name="Kensington", email="blake.kensington@email.com", password="KensingtonB10", phone_number="(714)-555-0816", gender="Male", team_id=4),
    MockPlayer(first_name="Ruby", last_name="Wentworth", email="ruby.wentworth@email.com", password="WentworthR11", phone_number="(404)-555-0643", gender="Female", team_id=4),
    MockPlayer(first_name="Julian", last_name="Harrington", email="julian.harrington@email.com", password="HarringtonJ12", phone_number="(206)-555-0789", gender="Male", team_id=4),
    MockPlayer(first_name="Stella", last_name="Whitmore", email="stella.whitmore@email.com", password="WhitmoreS13", phone_number="(646)-555-0285", gender="Female", team_id=4),
    MockPlayer(first_name="Xavier", last_name="Lennox", email="xavier.lennox@email.com", password="LennoxX14", phone_number="(503) 555-0392", gender="Male", team_id=4),
    MockPlayer(first_name="Violet", last_name="Stratton", email="violet.stratton@email.com", password="StrattonV15", phone_number="(415)-555-0558", gender="Female", team_id=4),
    MockPlayer(first_name="Dominic", last_name="Langley", email="dominic.langley@email.com", password="LangleyD16", phone_number="(702)-555-0747", gender="Male", team_id=5),
    MockPlayer(first_name="Hazel", last_name="Beaumont", email="hazel.beaumont@email.com", password="BeaumontH17", phone_number="(917)-555-0239", gender="Female", team_id=5),
]

Teams = [tigers, cardinals, orioles, jays, dodgers, rangers, astros, angels, rockies, royals, cubs, padres, white_sox, guardians, braves, giants, brewers, nationals, rays, marlins, yankees, red_sox, diamondbacks, mets, reds, phillies, pirates, mariners]

class MockDivision(BaseModel):
    division_id: int
    division_name: str

mock_divisions = [
    MockDivision(division_id=0, division_name="Team Bank"),
    MockDivision(division_id=1, division_name="A"),
    MockDivision(division_id=2, division_name="B"),
    MockDivision(division_id=3, division_name="C"),
    MockDivision(division_id=4, division_name="D"),
]

def insert_mock_season_settings():
    insert_season_settings("Default", "2025-05-05", "2025-08-20", 20)

def insert_mock_divisions():
    for division in mock_divisions:
        insert_division_with_id(division.division_id, division.division_name)

# function which inserts ~30 mock teams into the DB
# note: always call insert_mock_divisions() before calling this function to ensure division_id foreign key integrity
def insert_mock_teams():
    for team in Teams:
        insert_team(team.team_name, team.username, team.password, team.division, team.preferred_division, team.offday, team.preferred_time)

# function which inserts ~30 mock players into the DB
# note: always call insert_mock_teams() before calling this function to ensure team_id foreign key integrity
def insert_mock_players():
    for player in mock_players:
        insert_mock_player(player.first_name, player.last_name, player.email, player.password, player.phone_number, player.gender, player.team_id)

def insert_mock_schedule():
    insert_mock_season_settings()
    insert_mock_divisions()
    insert_mock_teams()
    insert_mock_players()
    