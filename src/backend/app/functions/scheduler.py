
from datetime import timedelta
from sys import maxsize
import time

# All variables here are global for use in the backtrack scheduler algorithm
# They should not be changed outside of the function that starts the algorithm (TODO)
# or the recursive function (backtrack_scheduler)
games = [] # Get this from gen_sched_input.py, set in function that starts the algorithm (TODO)
game_slots = []
teams = []

# Hard constraints are a list of functions that return True if the constraint passes
hard_constraints = []
# Soft constraints are a list of tuples, the first element is the function and the second is the weight
soft_constraints = []
# Final schedule is a dictionary of games with assigned game slots. Games are keys game slots are values
best_schedule = {}
# Larger scores are worse, a score of 0 means no soft constraints are violated
best_score: int = maxsize

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
        if abs(sched_game_slot[2] - game_slot[2]) <= timedelta(days=7):
            # Iterate through both teams in game, if either team is in the game at the same game_slot constraint fails
            for team in game:
                if team in schedule[sched_game_slot]:
                    games_in_week += 1
                    if games_in_week > MAX_ALLOWED_GAMES_PER_WEEK:
                        return False
    return True


# Constraint 4: Teams should avoid playing on their recorded offday
def constraint4(game, game_slot, schedule):
    global teams
    # Checks each team involved in the game
    weekday: int = game_slot[2].weekday()
    for team in game:
        if teams[team]["offday"] == weekday:
            return False # ISSUE: If both teams have an offday on this day it will be weighted the same as one team having an offday
    return True


# Builds the list of hard and soft constraints
def gen_constraints():
    global hard_constraints, soft_constraints
    hard_constraints = []
    soft_constraints = []
    hard_constraints.append(constraint1)
    hard_constraints.append(constraint2)
    # hard_constraints.append(constraint3)
    # soft_constraints.append((constraint4, 1))
    hard_constraints.append(constraint4)


# Recusive function that takes an index from the games list that refers to a game
def backtrack_scheduler_w_skip(curr_game: int, schedule: dict, curr_score: int):
    global games, game_slots, hard_constraints, soft_constraints, best_schedule, best_score
    # Base case, no more games to assign game_slots
    if curr_game >= len(games):
        if curr_score < best_score:
            best_score = curr_score
            best_schedule = schedule.copy()
            # print(best_schedule)
        # If no soft constraints are violated, return the schedule as it is optimal
        if best_score == 0:
            return schedule
        # Else continue searching
        return False
    
    print(best_score)
    if best_score == 1:
        print(best_schedule)
    # time.sleep(0.1)
    
    game = games[curr_game]

    soft_constrained_slots = []

    for game_slot in game_slots:
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
                if not soft_constraint[0](game, game_slot, schedule):
                    # If constraint fails, add the weight to the score
                    # new_score += soft_constraint[1]

                    soft_constrained = True
                    soft_constrained_slots.append((game_slot, soft_constraint[1]))
                    # Maybe skip to next iteration here and add game_slot to an array of slots that pass hard but fail soft
                    # Then test that array after all game_slots are tested
            # If soft constrained, skip this iteration
            if soft_constrained:
                continue
            
            # curr_score += new_score
            schedule[game_slot] = game

            new_schedule = backtrack_scheduler_w_skip(curr_game + 1, schedule, curr_score)
            # If the returned schedule is valid, pass it back
            if new_schedule:
                return new_schedule
            
            # Backtracking requires unassigning game_slot and undoing score
            # curr_score -= new_score
            schedule.pop(game_slot)

    for constrained_slot in soft_constrained_slots:
        curr_score += constrained_slot[1]
        schedule[constrained_slot[0]] = game

        new_schedule = backtrack_scheduler_w_skip(curr_game + 1, schedule, curr_score)
        # If the returned schedule is valid, pass it back
        if new_schedule:
            return new_schedule
        
        # Backtracking requires unassigning game_slot and undoing score
        curr_score -= constrained_slot[1]
        schedule.pop(constrained_slot[0])

    return False

# Recusive function that takes an index from the games list that refers to a game
def backtrack_scheduler(curr_game: int, schedule: dict, curr_score: int):
    global games, game_slots, hard_constraints, soft_constraints, best_schedule, best_score
    # Base case, no more games to assign game_slots
    if curr_game >= len(games):
        if curr_score < best_score:
            best_score = curr_score
            best_schedule = schedule
        # If no soft constraints are violated, return the schedule as it is optimal
        if best_score == 0:
            return schedule
        # Else continue searching
        return False
    
    print(best_score)
    if best_score == 1:
        print(best_schedule)
    # time.sleep(0.1)
    
    game = games[curr_game]

    for game_slot in game_slots:
        passesConstraints = True
        for hard_constraint in hard_constraints:
            if not hard_constraint(game, game_slot, schedule):
                passesConstraints = False
                break

        # If all constraints pass
        if passesConstraints:
            # Calculate soft constraint score of the current assignment
            new_score: int = 0
            for soft_constraint in soft_constraints:
                if not soft_constraint[0](game, game_slot, schedule):
                    # If constraint fails, add the weight to the score
                    new_score += soft_constraint[1]
            
            curr_score += new_score
            schedule[game_slot] = game

            new_schedule = backtrack_scheduler(curr_game + 1, schedule, curr_score)
            # If the returned schedule is valid, pass it back
            if new_schedule:
                return new_schedule
            
            # Backtracking requires unassigning game_slot and undoing score
            curr_score -= new_score
            schedule.pop(game_slot)

    return False


def gen_schedule_w_skip(games_to_sched, game_slots_to_sched, teams_to_sched):
    global games, game_slots, teams
    games = games_to_sched
    game_slots = game_slots_to_sched
    teams = teams_to_sched
    gen_constraints()
    if backtrack_scheduler_w_skip(0, {}, 0):
        return best_schedule, best_score
    
    
def gen_schedule(games_to_sched, game_slots_to_sched, teams_to_sched):
    global games, game_slots, teams
    games = games_to_sched
    game_slots = game_slots_to_sched
    teams = teams_to_sched
    gen_constraints()
    if backtrack_scheduler(0, {}, 0):
        return best_schedule, best_score