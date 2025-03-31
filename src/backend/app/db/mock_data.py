from pydantic import BaseModel
from ..db.queries.team_queries import insert_team
from ..db.queries.mock_queries import insert_mock_player
from ..db.queries.division_queries import insert_division_with_id
from ..db.queries.season_settings_queries import insert_season_settings
from ..db.queries.team_players_queries import insert_team_player
from ..db.queries.waiver_queries import insert_waiver_format, insert_waiver


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

class MockWaiverFormat(BaseModel):
    id: int
    year: int
    index: int
    text: str

mock_waiver_formats = [
    MockWaiverFormat(id=1, year=2025, index=0, text="GSA Softball Player Waiver 2024"),
    MockWaiverFormat(id=2, year=2025, index=1, text="This is the player participation waiver for participating in the GSA softball league for the 2024 summer season. In lieu of a written signature, your written information and name is treated as legally binding consent. Please read the following regarding electronic signatures.\n\nAccording to the Electronic Commerce Act, 200, S.O. 2000 , c. 17 (\"the Act\"):\n\nSection 1(1) of the Act defines an electronic signature as: “electronic information that a person creates or adopts in order to sign a document and that is in, attached to or associated with the document;”. The Act also provides that any legal requirement of signing may be satisfied by an electronic signature provided that both parties implicitly or explicitly consent. Therefore, typing your name at the end of this form is treated as an \"electronic signature\" according to the act.\n\nThe execution of this Agreement by electronic means shall be deemed to constitute effective execution of this Agreement as to the parties hereto. Such electronic signatures may be used by the parties in lieu of the original signature page[s] of this Agreement for any and all purposes. Additionally, any signatures of the parties to this Agreement that are transmitted to the other party by facsimile shall be deemed original signatures for all purposes.\n\nPlease direct comments or concerns to Jake Nease at j.a.nease@outlook.com.\n\nThe risk of injury from the activities involved in this program is significant, including the potential for permanent paralysis and death, and while particular rules, equipment, and personal discipline may reduce this risk, the risk of serious injury does exist."),
    MockWaiverFormat(id=3, year=2025, index=2, text="The risk of injury from the activities involved in this program is significant, including the potential for permanent paralysis and death, and while particular rules, equipment, and personal discipline may reduce this risk, the risk of serious injury does exist."),
    MockWaiverFormat(id=4, year=2025, index=3, text="I KNOWINGLY AND FREELY ASSUME ALL SUCH RISKS, both known and unknown, EVEN IF ARISING FROM THE NEGLIGENCE OF THE RELEASES or others, and assume full responsibility for my participation."),
    MockWaiverFormat(id=5, year=2025, index=4, text="I willingly agree to comply with the stated and customary terms and conditions for participation. If however, I observe any unusual significant hazard during my presence or participation, I will remove myself from participation and bring such to the attention of the nearest official immediately."),
    MockWaiverFormat(id=6, year=2025, index=5, text="I, for myself and on behalf of my heirs, assigns, personal representatives and next of kin, HEREBY RELEASE AND HOLD HARMLESS the Graduate Students Association of McMaster University their officers, officials, agents, and or employees, other participants, sponsoring agencies, sponsors, advertisers, and if applicable, owners and lessors or premises used to conduct the even (\"RELEASES\"), WITH RESPECT TO ANY AND ALL INJURY, DISABILITY, DEATH, or loss or damage to person or property, WHETHER ARISING FROM THE  NEGLIGENCE OF THE RELEASEES OR OTHERWISE, to the fullest extent permitted by law."),
    MockWaiverFormat(id=7, year=2025, index=6, text="I HAVE READ THIS RELEASE OF LIABILITY AND ASSUMPTION OF RISK AGREEMENT, FULLY UNDERSTAND ITS TERMS, UNDERSTAND THAT I HAVE GIVEN UP SUBSTANTIAL RIGHTS BY SIGNING IT, AND SIGN IT FREELY AND VOLUNTARILY WITHOUT ANY INDUCEMENT.")
]

def insert_mock_waiver_formats():
    for waiver in mock_waiver_formats:
        insert_waiver_format(waiver.year, waiver.index, waiver.text)

def insert_mock_divisions():
    for division in mock_divisions:
        insert_division_with_id(division.division_id, division.division_name)

def insert_mock_season_settings():
    insert_season_settings("Default", "2025-05-05", "2025-08-20", 20)

# function which inserts ~30 mock teams into the DB
# note: always call insert_mock_divisions() before calling this function to ensure division_id foreign key integrity
def insert_mock_teams():
    for team in Teams:
        insert_team(team.team_name, team.username, team.password, team.division, team.preferred_division, team.offday, team.preferred_time)

# function which inserts ~30 mock players into the DB
# note: always call insert_mock_teams() before calling this function to ensure team_id foreign key integrity
def insert_mock_players():
    i = 1
    for player in mock_players:
        insert_mock_player(player.first_name, player.last_name, player.email, player.password, player.phone_number, player.gender, player.team_id)
        insert_team_player(player.team_id, i)
        insert_waiver(i, player.first_name + player.last_name, player.first_name + player.last_name, 2025)
        i += 1

def insert_mock_schedule():
    #insert_mock_divisions()
    #insert_mock_season_settings()
    insert_mock_teams()
    insert_mock_players()
    #insert_mock_waiver_formats()
    