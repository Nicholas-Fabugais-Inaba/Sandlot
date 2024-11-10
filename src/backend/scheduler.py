
from datetime import timedelta
from random import shuffle

# All variables here are global for use in the backtrack scheduler algorithm
# They should not be changed outside of the function that starts the algorithm (TODO)
# or the recursive function (backtrack_scheduler)
games = [] # Get this from gen_sched_input.py, set in function that starts the algorithm (TODO)
game_slots = []

# Final schedule is a dictionary of games with assigned game slots. Games are keys game slots are values
schedule = {}

hard_constraints = []

MAX_ALLOWED_GAMES_PER_WEEK = 2


# Constraint 1: No game should use a game slot already assigned to another game
# (Hard Constraint)
def constraint1(game, game_slot, schedule):
    if game_slot in schedule.keys():
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
        if abs(sched_game_slot[2] - game_slot[2]) <= timedelta(days=7):
            # Iterate through both teams in game, if either team is in the game at the same game_slot constraint fails
            for team in game:
                if team in schedule[sched_game_slot]:
                    games_in_week += 1
                    if games_in_week > MAX_ALLOWED_GAMES_PER_WEEK:
                        return False
    return True

# Builds the list of constraints
def gen_constraints(teams):
    global hard_constraints
    hard_constraints = []
    hard_constraints.append(constraint1)
    hard_constraints.append(constraint2)
    hard_constraints.append(constraint3)
    # TODO generate soft constraints for off-days and prefered times
    # This will use the teams argument to find off days


# Recusive function that takes an index from the games list that refers to a game
def backtrack_scheduler(curr_game: int, schedule: dict):
    global games, game_slots, hard_constraints
    # Base case, no more games to assign game_slots
    if curr_game >= len(games):
        return schedule
    game = games[curr_game]
    for game_slot in game_slots:
        passesConstraints = True
        for hard_constraint in hard_constraints:
            if not hard_constraint(game, game_slot, schedule):
                passesConstraints = False
                break
        # If all constraints pass
        if passesConstraints:
            schedule[game_slot] = game
            new_schedule = backtrack_scheduler(curr_game + 1, schedule)
            # If the returned schedule is valid, pass it back
            if new_schedule:
                return new_schedule
            # print("backtracking")
            schedule.pop(game_slot)
    return False


def gen_schedule(games_to_sched, game_slots_to_sched, teams):
    global games, game_slots
    games = games_to_sched
    game_slots = game_slots_to_sched
    gen_constraints(teams)
    return backtrack_scheduler(0, {})

def gen_schedule_random_game_slots(games_to_sched, game_slots_to_sched, teams):
    global games, game_slots
    games = games_to_sched
    game_slots = game_slots_to_sched
    shuffle(game_slots)
    gen_constraints(teams)
    return backtrack_scheduler(0, {})