
# All variables here are global for use in the backtrack scheduler algorithm
# They should not be changed outside of the function that starts the algorithm (TODO)
# or the recursive function (backtrack_scheduler)
games = [] # Get this from gen_sched_input.py, set in function that starts the algorithm (TODO)

# Final schedule is a dictionary of games with assigned game slots. Games are keys game slots are values
schedule = {}

constraints = []


# Constraint 1: No game should use a game slot already assigned to another game
def constraint1(game, game_slot):
    if game_slot in schedule.values():
        return False
    return True


# Constraint 2: No team should play more than one game a day
def constraint2(game, game_slot):
    for sched_game in schedule:
        # If the date matches, check if either team matches
        if schedule[sched_game][2] == game_slot[2]:
            # Iterate through both teams in game, if either team is in the game at the same game_slot constraint fails
            for team in game:
                if team in sched_game:
                    return False
    return True


# Builds the list of constraints
def gen_constraints():
    constraints.append(constraint1)
    constraints.append(constraint2)


# Recusive function that takes an index from the games list that refers to a game
def backtrack_scheduler(curr_game: int):
    pass
