
import datetime
from sys import maxsize
import time
from ..db.queries.mock_queries import insert_mock_game
import random

# All variables here are global for use in the backtrack scheduler algorithm
# They should not be changed outside of the function that starts the algorithm (TODO)
# or the recursive function (backtrack_scheduler)
games = [] # Get this from gen_sched_input.py, set in function that starts the algorithm (TODO)
game_slots = []
teams = []

# Dict of weeks played by each team
weeks_played = {}

# Hard constraints are a list of functions that return True if the constraint passes
hard_constraints = []
# Soft constraints are a list of tuples, the first element is the function and the second is the weight
soft_constraints = []
# Final schedule is a dictionary of games with assigned game slots. Games are keys game slots are values
best_schedule = {}
# Larger scores are worse, a score of 0 means no soft constraints are violated
best_score: int = maxsize

start_time = 0
MAX_RUNTIME = 60

MAX_ALLOWED_GAMES_PER_WEEK = 2


# Constraint 1: No game should use a game slot already assigned to another game
# (Hard Constraint)
def constraint1(game, game_slot, schedule):
    if game_slot in schedule:
        return False
    return True


# Constraint 2: No team should play more than one game a day
# (Hard Constraint)
def constraint2(game, game_slot, schedule):
    for sched_game_slot in schedule:
        # If the date matches, check if either team matches
        if sched_game_slot[2] == game_slot[2]:
            # Iterate through both teams in game, if either team is in the game at the same game_slot constraint fails
            for team in game:
                if team in schedule[sched_game_slot]:
                    return False
    return True

# Constraint 3: No team should play more than twice a week
# (Hard Constraint)
def constraint3(game, game_slot, schedule):
    games_in_week: int = 1
    for sched_game_slot in schedule:
        # If the date is within a week, add one to the counter
        if abs(sched_game_slot[2] - game_slot[2]) <= datetime.timedelta(days=7):
            # Iterate through both teams in game, if either team is in the game at the same game_slot constraint fails
            for team in game:
                if team in schedule[sched_game_slot]:
                    games_in_week += 1
                    if games_in_week > MAX_ALLOWED_GAMES_PER_WEEK:
                        return False
    return True


# Constraint 4: Teams should never play on their recorded offday
def constraint4(game, game_slot, schedule):
    global teams
    # Checks each team involved in the game
    weekday: int = game_slot[2].weekday()
    for team in game:
        if teams[team]["offday"] == weekday:
            return False
    return True

# Soft Constraint 1: Teams should avoid playing on their recorded offday
def soft_constraint1(game, game_slot, schedule):
    global teams
    # Checks each team involved in the game
    weekday: int = game_slot[2].weekday()
    score = 0
    for team in game:
        if teams[team]["offday"] == weekday:
            score += 3
    return score

# Soft Constraint 2: Teams should avoid playing timeslots they don't prefer
# 0 = No preference, 1 = Early, 2 = Balanced, 3 = Late
def soft_constraint2(game, game_slot, schedule):
    global teams
    # Checks each team involved in the game
    time = game_slot[1]
    score = 0
    for team in game:
        if teams[team]["pref_time"] == 1: # Early preference
            if time == 3 or time == 4:
                score += 1
        elif teams[team]["pref_time"] == 2: # Balanced preference
            continue
        elif teams[team]["pref_time"] == 3: # Late preference
            if time == 1 or time == 2:
                score += 1
    return score


def find_least_played_weeks(team1, team2):
    # weeks_played is a dictionary where keys are teams and values are dictionaries of weeks and number of games played
    team1_weeks = weeks_played[team1]
    team2_weeks = weeks_played[team2]

    # Find the weeks with the least number of games played between team1 and team2
    min_play_count = float('inf')
    least_played_weeks = []

    for week in team1_weeks.keys():
        total_games = team1_weeks[week] + team2_weeks[week]
        if total_games < min_play_count:
            min_play_count = total_games
            least_played_weeks = [week]
        elif total_games == min_play_count:
            least_played_weeks.append(week)

    return least_played_weeks


# Recusive function that takes an index from the games list that refers to a game
def backtrack_scheduler_w_skip():
    global games, game_slots, hard_constraints, soft_constraints, best_schedule, best_score

    schedule = {}
    start_week = 0
    curr_score = 0

    # If the start_week is greater than the number of weeks, reset it to 0
    if start_week >= len(game_slots):
            start_week = 0

    for game in games: # Loop through all games
        soft_constrained_slots = []

        # Find the least played weeks for the teams in the game
        # CURRENTLY this just uses a week from the list as a starting place, if the week is full it will move to the next week sequentially.
        least_played_weeks = find_least_played_weeks(game[0], game[1])
        # print(least_played_weeks)
        # Select a random week from the least played weeks to keep games from piling up early in the season
        start_week = random.choice(least_played_weeks)
        curr_week = start_week

        while True: # Loop through all weeks
            slot_chosen = False
            # print(schedule)
            # print("Week: ", curr_week)
            week_slots = game_slots[curr_week]
            # Shuffle week_slots to keep games from piling up early in the week
            random.shuffle(week_slots)
            for game_slot in week_slots:
                passesConstraints = True
                for hard_constraint in hard_constraints:
                    if not hard_constraint(game, game_slot, schedule):
                        passesConstraints = False
                        break

                # If all constraints pass
                if passesConstraints:
                    # Calculate soft constraint score of the current assignment
                    # new_score: int = 0
                    soft_constrained = False
                    for soft_constraint in soft_constraints:
                        soft_constraint_score = soft_constraint(game, game_slot, schedule)
                        if soft_constraint_score != 0:
                            # If timeslot adds to score (fails soft constraint), mark as soft constrained and skip it
                            soft_constrained = True
                            # All soft constrained slots will be added to a list to be considered later
                            soft_constrained_slots.append((game_slot, soft_constraint_score))
                    # If soft constrained, skip this iteration
                    if soft_constrained:
                        continue

                    schedule[game_slot] = game
                    # Update the weeks list for teams played
                    for team in game:
                        weeks_played[team][curr_week] += 1

                    slot_chosen = True
                    break
            if slot_chosen:
                break

            curr_week += 1
            print(len(game_slots))
            if curr_week >= len(game_slots):
                curr_week = 0
            if curr_week == start_week:
                break

        if not slot_chosen and len(soft_constrained_slots) > 0:
            # Find the soft constrained slot with the lowest score
            lowest_score_slot = min(soft_constrained_slots, key=lambda x: x[1])
            curr_score += lowest_score_slot[1]
            schedule[lowest_score_slot[0]] = game
            slot_chosen = True

        if not slot_chosen:
            return False, maxsize

    return schedule, curr_score


# Builds the list of hard and soft constraints
def gen_constraints():
    global hard_constraints, soft_constraints
    hard_constraints = []
    soft_constraints = []
    hard_constraints.append(constraint1)
    hard_constraints.append(constraint2)
    # hard_constraints.append(constraint3)
    hard_constraints.append(constraint4)
    # soft_constraints.append(soft_constraint1)
    soft_constraints.append(soft_constraint2)


def initialize_weeks_played(teams, num_weeks):
    # Initialize the weeks_played dictionary
    for team in teams:
        weeks_played[team] = {week: 0 for week in range(0, num_weeks)}

    return weeks_played


def gen_schedule_w_skip(games_to_sched, game_slots_to_sched, teams_to_sched):
    global games, game_slots, teams
    games = games_to_sched
    game_slots = game_slots_to_sched
    teams = teams_to_sched
    gen_constraints()
    initialize_weeks_played(teams, len(game_slots))
    print("starting schedule generation")
    schedule, score = backtrack_scheduler_w_skip()
    if schedule:
        return schedule, score, teams
    else:
        return [], maxsize, teams


def send_schedule_to_db(schedule: dict, score: int, teams: dict):
    demo_day = datetime.date(2025, 6, 23)
    for gameslot, game in schedule.items():
        if(gameslot[2] < demo_day):
            insert_mock_game(int(teams[game[0]]["id"]), int(teams[game[1]]["id"]), gameslot[2], gameslot[1], gameslot[0], random.randint(1, 8), random.randint(1, 8), True)
        else:
            insert_mock_game(int(teams[game[0]]["id"]), int(teams[game[1]]["id"]), gameslot[2], gameslot[1], gameslot[0], 0, 0, False)
