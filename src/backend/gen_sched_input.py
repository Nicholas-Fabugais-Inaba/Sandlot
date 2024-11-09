
from datetime import date, timedelta


FIELDS = 3
TIMESLOTS = 3
START_DATE = date(2024, 5, 1)
END_DATE = date(2024, 5, 7)
#END_DATE = date(2024, 8, 31)

tigers = {"name": "Tigers", "offday": 1}
cardinals = {"name": "Cardinals", "offday": 2}
orioles = {"name": "Orioles", "offday": 4}
jays = {"name": "Blue Jays", "offday": 2}
dodgers = {"name": "Dodgers", "offday": 3}
teams: dict = {1: tigers, 2: cardinals, 3: orioles, 4: jays, 5: dodgers}


def gen_games(teams, rounds: int):
    games = []
    for team1 in teams.keys():
        for team2 in teams.keys():
            if team1 != team2:
                game = {team1, team2}
                if game not in games:
                    for i in range(0, rounds):
                        games.append(game)
    return games


def gen_game_slots(fields: int, timeslots: int, start_date: date, end_date: date):
    game_slots = []
    for day in get_weekdays(start_date, end_date):
        for field in range(1, fields + 1):
            for timeslot in range(1, timeslots + 1):
                game_slots.append((field, timeslot, day))
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

game_slots = gen_game_slots(FIELDS, TIMESLOTS, START_DATE, END_DATE)
print(game_slots)
print(len(game_slots))

# Constraint generation code will be in scheduler.py
