
from datetime import date, timedelta
from scheduler import gen_schedule, gen_schedule_w_skip
from random import shuffle


FIELDS = 3
TIMESLOTS = 3
START_DATE = date(2024, 5, 1)
END_DATE = date(2024, 6, 30)
# END_DATE = date(2024, 8, 31)

# OFFDAYS ARE CODED AS 0 BEING MONDAY AND 6 BEING SUNDAY (matching datetime)
tigers = {"name": "Tigers", "offday": 0}
cardinals = {"name": "Cardinals", "offday": 2}
orioles = {"name": "Orioles", "offday": 4}
jays = {"name": "Blue Jays", "offday": 2}
dodgers = {"name": "Dodgers", "offday": 3}
rangers = {"name": "Rangers", "offday": 1}
astros = {"name": "Astros", "offday": 0}
angels = {"name": "Angels", "offday": 4}
teams: dict = {1: tigers, 2: cardinals, 3: orioles, 4: jays, 5: dodgers, 6: rangers, 7: astros, 8: angels}


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


games = gen_games(teams, 2)
print(games)

game_slots = gen_game_slots(FIELDS, TIMESLOTS, START_DATE, END_DATE, len(teams))
print(game_slots)
print(len(game_slots))

# Constraint generation code will be in scheduler.py
schedule, score = gen_schedule_w_skip(games, game_slots, teams)
print(schedule)
print(score)

# Randomizing game_slots vastly increases runtime, do not randomize game_slots
# schedule_rand_slots = gen_schedule_random_game_slots(games, game_slots, teams)
# print(schedule_rand_slots)
