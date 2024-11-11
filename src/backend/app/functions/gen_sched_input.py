
from datetime import date, timedelta
from .scheduler import gen_schedule, gen_schedule_w_skip
from random import shuffle


FIELDS = 3
TIMESLOTS = 3
START_DATE = date(2024, 5, 1)
END_DATE = date(2024, 5, 3)
# END_DATE = date(2024, 8, 31)

# OFFDAYS ARE CODED AS 0 BEING MONDAY AND 6 BEING SUNDAY (matching datetime)
tigers = {"name": "Tigers", "offday": 0}
cardinals = {"name": "Cardinals", "offday": 1}
orioles = {"name": "Orioles", "offday": 0}
jays = {"name": "Blue Jays", "offday": 0}
dodgers = {"name": "Dodgers", "offday": 0}
# rangers = {"name": "Rangers", "offday": 1}
# astros = {"name": "Astros", "offday": 0}
# angels = {"name": "Angels", "offday": 4}
# yankees = {"name": "Yankees", "offday": 3}
# mets = {"name": "Mets", "offday": 1}
# giants = {"name": "Giants", "offday": 3}
# cubs = {"name": "Cubs", "offday": 0}
# mariners = {"name": "Mariners", "offday": 2}
# red_sox = {"name": "Red Sox", "offday": 4}
# brewers = {"name": "Brewers", "offday": 2}
# braves = {"name": "Braves", "offday": 1}
teams: dict = {
    1: tigers,
    2: cardinals,
    3: orioles,
    4: jays,
    5: dodgers,
    # 6: rangers,
    # 7: astros,
    # 8: angels,
    # 9: yankees,
    # 10: mets,
    # 11: giants,
    # 12: cubs,
    # 13: mariners,
    # 14: red_sox,
    # 15: brewers,
    # 16: braves
}

schedule = {}
json_schedule = {}
score: int = 0


def gen_games(teams, rounds: int):
    games = []
    n = len(teams)
    for i in range(0, rounds):
        round = []
        for team1 in teams.keys():
            for team2 in teams.keys():
                if team1 != team2:
                    game = (team1, team2)
                    if (team1, team2) not in round and (team2, team1) not in round:
                        round.append(game)
        games.extend(round)
    reordered_games = [games[i + j * n] for i in range(n) for j in range(len(games) // n)]
    return reordered_games


def gen_game_slots(fields: int, timeslots: int, start_date: date, end_date: date, num_teams: int):
    game_slots = []
    n = num_teams
    for field in range(1, fields + 1):
        for timeslot in range(1, timeslots + 1):
            for day in get_weekdays(start_date, end_date):
                game_slots.append((field, timeslot, day))
    # reordered_game_slots = [game_slots[i + j * n] for i in range(n) for j in range(len(game_slots) // n)]
    # return reordered_game_slots
    return game_slots


def get_weekdays(start_date: date, end_date: date):
    weekdays = []
    
    # Iterate through the date range
    current_date = start_date
    while current_date <= end_date:
        # Check if the current date is a weekday (Monday=0, Sunday=6)
        if current_date.weekday() < 5:  # Monday to Friday are 0 to 4
            weekdays.append(current_date)  # Add the date
        current_date += timedelta(days=1)  # Move to the next day
    
    return weekdays


def create_schedule():
    global teams, schedule, json_schedule, score
    games = gen_games(teams, 2)
    game_slots = gen_game_slots(FIELDS, TIMESLOTS, START_DATE, END_DATE, len(teams))
    schedule, score = gen_schedule_w_skip(games, game_slots, teams)
    json_schedule = {}
    for element in schedule:
        year = element[2].year
        month = element[2].month
        day = element[2].day
        json_schedule[element[0], element[1], (year, month, day)] = schedule[element]
    return [json_schedule, teams]


def get_teams():
    global teams
    return teams


def get_schedule():
    global json_schedule
    return json_schedule


def get_score():
    global score
    return score
