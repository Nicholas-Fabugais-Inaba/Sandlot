
from datetime import date, timedelta
from .scheduler import gen_schedule, gen_schedule_w_skip, send_schedule_to_db
# from scheduler import gen_schedule, gen_schedule_w_skip
from random import shuffle
from ..db.queries import get_all_teams


FIELDS = 3
TIMESLOTS = 3
START_DATE = date(2025, 5, 5)
# END_DATE = date(2024, 6, 30)
END_DATE = date(2025, 8, 20)

GAMES_PER_TEAM = 25 # CURRENTLY BROKEN

# OFFDAYS ARE CODED AS 0 BEING MONDAY AND 6 BEING SUNDAY (matching datetime)
teams = {}
div_a = {}
div_b = {}
div_c = {}
div_d = {}
Teams = get_all_teams()
for i in range(len(Teams)):
    teams[i] = {"id": Teams[i]["id"], "name": Teams[i]["team_name"], "offday": Teams[i]["offday"]}
    if Teams[i]["division"] == 0:
        div_a[i] = teams[i]
    elif Teams[i]["division"] == 1:
        div_b[i] = teams[i]
    elif Teams[i]["division"] == 2:
        div_c[i] = teams[i]
    elif Teams[i]["division"] == 3:
        div_d[i] = teams[i]

divs = [div_a, div_b, div_c, div_d]


def gen_games_round_robin_old(teams, rounds: int):
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

def gen_games_division(teams, games_per_team: int):
    games = []
    n = len(teams)
    for div in divs:
        div_games = gen_games_round_robin(div, games_per_team)
        games.extend(div_games)
    return games

def gen_games_round_robin(teams, games_per_team: int):
    team_list = list(teams.keys())
    if len(team_list) % 2 == 1:
        # Placeholder for an odd number of teams
        team_list.append("BYE")

    n = len(team_list)
    games = []

    for r in range(games_per_team):
        round_games = []
        for i in range(n // 2):
            team1 = team_list[i]
            team2 = team_list[n - i - 1]
            if team1 != "BYE" and team2 != "BYE":
                game = (team1, team2)
                # Add the game in both directions to alternate home/away balance
                if r % 2 == 0:
                    round_games.append(game)
                else:
                    round_games.append((team2, team1))
        games.extend(round_games)
        # Rotate the teams except the first one
        team_list = [team_list[0]] + team_list[-1:] + team_list[1:-1]
    return games


def gen_game_slots(fields: int, timeslots: int, start_date: date, end_date: date, num_teams: int):
    game_slots = []
    weekdays = get_weekdays(start_date, end_date)
    
    # Split weekdays into weeks
    weeks = []
    current_week = []
    for day in weekdays:
        if day.weekday() == 0 and current_week: # Monday and current_week is not empty
            weeks.append(current_week)
            current_week = []
        current_week.append(day)
    if current_week:
        weeks.append(current_week)

    for week in weeks:
        week_slots = []
        for field in range(1, fields + 1):
            for timeslot in range(1, timeslots + 1):
                for day in week:
                    week_slots.append((field, timeslot, day))
        game_slots.append(week_slots)

    return game_slots


def reorder(games, n):
    reordered_games = [games[i + j * n] for i in range(n) for j in range(len(games) // n)]
    return reordered_games


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
    games = reorder(gen_games_division(divs, GAMES_PER_TEAM), len(teams))
    game_slots = gen_game_slots(FIELDS, TIMESLOTS, START_DATE, END_DATE, len(teams))
    schedule, score = gen_schedule_w_skip(games, game_slots, teams)
    json_schedule = {}
    for element in schedule:
        year = element[2].year
        month = element[2].month
        day = element[2].day
        json_schedule[element[0], element[1], (year, month, day)] = schedule[element]
    return [json_schedule, teams]



# games = gen_games_division(divs, GAMES_PER_TEAM)
# print(games)
# print(len(games))


# game_slots = gen_game_slots(FIELDS, TIMESLOTS, START_DATE, END_DATE, len(teams))
# print(game_slots)
# print(len(game_slots))

# # # Constraint generation code will be in scheduler.py
# schedule, score, t = gen_schedule_w_skip(games, game_slots, teams)
# print(schedule)
# print(score)

# send_schedule_to_db(schedule, score, t)
