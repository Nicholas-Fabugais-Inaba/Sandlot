
from datetime import datetime, date, timedelta
from .scheduler import gen_schedule_w_skip, send_schedule_to_db
# from scheduler import gen_schedule_w_skip
from random import shuffle
from ..db.queries.team_queries import get_all_teams, get_all_season_teams
from ..db.queries.season_settings_queries import get_season_settings
from ..db.queries.timeslot_queries import get_all_timeslots

from ..db.mock_data import insert_mock_schedule


FIELDS = 3
TIMESLOTS = 4
START_DATE = date(2025, 5, 5) # May 5, 2025 (Monday)
END_DATE = date(2025, 8, 20) # August 20, 2025 (Wednesday)
# END_DATE = date(2024, 6, 30) # June 30, 2024 (Sunday)

GAMES_PER_TEAM = 25 # CURRENTLY BROKEN

# OFFDAYS ARE CODED AS 0 BEING MONDAY AND 6 BEING SUNDAY (matching datetime)
# tigers = {"name": "Tigers", "offday": 0}
# cardinals = {"name": "Cardinals", "offday": 2}
# orioles = {"name": "Orioles", "offday": 4}
# jays = {"name": "Blue Jays", "offday": 2}
# dodgers = {"name": "Dodgers", "offday": 3}
# rangers = {"name": "Rangers", "offday": 1}
# astros = {"name": "Astros", "offday": 0}
# angels = {"name": "Angels", "offday": 4}
# rockies = {"name": "Rockies", "offday": 2}
# royals = {"name": "Royals", "offday": 0}
# cubs = {"name": "Cubs", "offday": 3}
# padres = {"name": "Padres", "offday": 3}
# white_sox = {"name": "White Sox", "offday": 1}
# guardians = {"name": "Guardians", "offday": 2}
# braves = {"name": "Braves", "offday": 1}
# giants = {"name": "Giants", "offday": 0}
# brewers = {"name": "Brewers", "offday": 4}
# nationals = {"name": "Nationals", "offday": 3}
# rays = {"name": "Rays", "offday": 4}
# marlins = {"name": "Marlins", "offday": 2}
# yankees = {"name": "Yankees", "offday": 1}
# red_sox = {"name": "Red Sox", "offday": 2}
# diamondbacks = {"name": "Diamondbacks", "offday": 3}
# mets = {"name": "Mets", "offday": 4}
# reds = {"name": "Reds", "offday": 0}
# phillies = {"name": "Phillies", "offday": 1}
# pirates = {"name": "Pirates", "offday": 2}
# mariners = {"name": "Mariners", "offday": 3}

# teams = {0: tigers, 1: cardinals, 2: orioles, 3: jays, 4: dodgers, 5: rangers, 6: astros, 7: angels, 8: rockies, 9: royals, 10: cubs, 11: padres, 12: white_sox, 13: guardians, 14: braves, 15: giants, 16: brewers, 17: nationals, 18: rays, 19: marlins, 20: yankees, 21: red_sox, 22: diamondbacks, 23: mets, 24: reds, 25: phillies, 26: pirates, 27: mariners}
# div_a = {0: tigers, 1: cardinals, 2: orioles, 3: jays, 4: dodgers, 5: rangers, 6: astros}
# div_b = {7: angels, 8: rockies, 9: royals, 10: cubs, 11: padres, 12: white_sox, 13: guardians}
# div_c = {14: braves, 15: giants, 16: brewers, 17: nationals, 18: rays, 19: marlins, 20: yankees}
# div_d = {21: red_sox, 22: diamondbacks, 23: mets, 24: reds, 25: phillies, 26: pirates, 27: mariners}

# divs = [div_a, div_b, div_c, div_d]


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


def gen_games_division(divs: dict, games_per_team: int):
    games = []
    for div in divs.values():
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
    team_games_count = {team: 0 for team in team_list}
    iter_count = -1

    while all(count <= games_per_team for count in team_games_count.values()):
        round_games = []
        iter_count += 1
        for i in range(n // 2):
            team1 = team_list[i]
            team2 = team_list[n - i - 1]
            if team1 != "BYE" and team2 != "BYE":
                game = (team1, team2)
                # Add the game in both directions to alternate home/away balance
                if iter_count % 2 == 0:
                    round_games.append(game)
                else:
                    round_games.append((team2, team1))
                team_games_count[team1] += 1
                team_games_count[team2] += 1
        games.extend(round_games)
        # Rotate the teams except the first one
        team_list = [team_list[0]] + team_list[-1:] + team_list[1:-1]
    return games


def gen_game_slots(fields: int, timeslots: int, start_date: date, end_date: date):
    game_slots = []
    weekdays = get_weekdays(start_date, end_date)
    print(weekdays)
    
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
                if (field == 1 and (timeslot == 3 or timeslot == 4)) or (field == 2 and (timeslot == 3 or timeslot == 4)):
                    continue
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
        if current_date.weekday() >= 0 and current_date.weekday() < 5:  # Monday to Friday are 0 to 4
            weekdays.append(current_date)  # Add the date
        current_date += timedelta(days=1)  # Move to the next day
    
    return weekdays


# def create_schedule():
#     global teams, schedule, json_schedule, score
#     games = reorder(gen_games_division(divs, GAMES_PER_TEAM), len(teams))
#     game_slots = gen_game_slots(FIELDS, TIMESLOTS, START_DATE, END_DATE, len(teams))
#     schedule, score = gen_schedule_w_skip(games, game_slots, teams)
#     json_schedule = {}
#     for element in schedule:
#         year = element[2].year
#         month = element[2].month
#         day = element[2].day
#         json_schedule[element[0], element[1], (year, month, day)] = schedule[element]
#     return [json_schedule, teams]


def gen_mock_schedule():
    teams = {}
    div_a = {}
    div_b = {}
    div_c = {}
    div_d = {}
    Teams = get_all_teams()
    Settings = get_season_settings()
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

    start_date = datetime.strptime(Settings["start_date"], "%Y-%m-%d").date()
    end_date = datetime.strptime(Settings["end_date"], "%Y-%m-%d").date()

    games = gen_games_division(divs, Settings["games_per_team"])

    game_slots = gen_game_slots(FIELDS, TIMESLOTS, start_date, end_date)

    schedule, score, t = gen_schedule_w_skip(games, game_slots, teams)
    print(schedule)

    send_schedule_to_db(schedule, score, t)


def gen_schedule_repeated():
    teams = {}
    divs = {}

    # Teams = get_all_teams()
    Teams = get_all_season_teams()
    Settings = get_season_settings()

    for i in range(len(Teams)):
        # Skip teams in the "Team Bank" division
        if Teams[i]["division"] == 0:
            continue
        teams[Teams[i]["id"]] = {"id": Teams[i]["id"], "name": Teams[i]["team_name"], "offday": Teams[i]["offday"], "pref_time": Teams[i]["preferred_time"]}
        # If a team is in a division, create a dict, add it to divs with division number as key and add the team to the division dict
        if Teams[i]["division"] not in divs:
            divs[Teams[i]["division"]] = {}
        divs[Teams[i]["division"]][Teams[i]["id"]] = teams[Teams[i]["id"]]
    
    # If a division has one team remove the division
    divs = {k: v for k, v in divs.items() if len(v) > 1}

    # for i in range(len(Teams)):
    #     if Teams[i]["division"] != -1:
    #         teams[Teams[i]["id"]] = {"id": Teams[i]["id"], "name": Teams[i]["team_name"], "offday": Teams[i]["offday"], "pref_time": Teams[i]["preferred_time"]}
    #         # If a team is in a division, create a dict, add it to divs with division number as key and add the team to the division dict
    #         if Teams[i]["division"] not in divs:
    #             divs[Teams[i]["division"]] = {}
    #         divs[Teams[i]["division"]][Teams[i]["id"]] = teams[Teams[i]["id"]]
    #     else:
    #         skipped_teams += 1

    start_date = datetime.strptime(Settings["start_date"], "%Y-%m-%d").date()
    end_date = datetime.strptime(Settings["end_date"], "%Y-%m-%d").date()
    print(start_date, end_date)

    games = gen_games_division(divs, Settings["games_per_team"])

    Timeslots = get_all_timeslots()
    print(Timeslots)

    total_fields, max_timeslots = analyze_timeslots(Timeslots)

    game_slots = gen_game_slots(total_fields, max_timeslots, start_date, end_date)

    # Repeats the schedule generation 10 times and returns the best schedule
    best_schedule, best_score, t = gen_schedule_w_skip(games, game_slots, teams)
    for i in range(10):
        schedule, score, t = gen_schedule_w_skip(games, game_slots, teams)
        if score < best_score:
            best_schedule = schedule
            best_score = score
    print(best_schedule, teams)
    return best_schedule, best_score, teams


def get_teams():
    teams = {}
    Teams = get_all_teams()
    for i in range(len(Teams)):
        teams[i] = {"id": Teams[i]["id"], "name": Teams[i]["team_name"], "offday": Teams[i]["offday"]}
    return teams


def analyze_timeslots(timeslots: dict):
    field_counts = {}  # Dictionary to store the count of timeslots per field
    max_timeslots = 0  # Variable to track the maximum number of timeslots for any field

    for timeslot_data in timeslots:
        field_id = timeslot_data["field_id"]

        # Increment the count for the field
        if field_id not in field_counts:
            field_counts[field_id] = 0
        field_counts[field_id] += 1

        # Update the maximum timeslots if this field has more
        max_timeslots = max(max_timeslots, field_counts[field_id])

    # Count the total number of fields
    total_fields = len(field_counts)

    return total_fields, max_timeslots


# games = gen_games_division(divs, GAMES_PER_TEAM)
# print(games)
# print(len(games))


# game_slots = gen_game_slots(FIELDS, TIMESLOTS, START_DATE, END_DATE)
# print(game_slots)
# print(len(game_slots))


# # # Constraint generation code will be in scheduler.py
# schedule, score, t = gen_schedule_w_skip(games, game_slots, teams)
# print(schedule)
# print(score)


# send_schedule_to_db(schedule, score, t)


#insert_mock_schedule()
#gen_mock_schedule()