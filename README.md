# Sandlot

Developer Names:
- Nicholas Fabugais-Inaba
- Casra Ghazanfari
- Jung Woo Lee
- Alexander Verity

Date of project start: \
September 16th 2024

Welcome to the Sandlot project, a web-based service that enables league and schedule management from a convenient user interface. Our solution utilizes a modernized UI and the additional features of player-specific logins, real-time standings, and commissioner announcements. Additionally, enhanced stability is key in replacing
the lack of maintainability of the current website.

The folders and files for this project are as follows:

docs - Documentation for the project \
refs - Reference material used for the project, including papers \
src - Source code \
test - Test cases \
etc.

## Features
- Scheduling: View your team's schedule and send reschedule requests to opposing teams.
- League Management: Edit game scores, accept reschedule requests, and more with commissioner-level permissions.
- Account Management: Register and sign in as a player or team account with NextAuth user authentication.
- Real-time Data: Access up-to-date standings, announcements, and team information.

## Deployment

#### NOTE: Make sure you run `npm install` in the file directory `../src/website/sandlot`.

Open up the integrated terminal directory:

```
../src/website/sandlot
```

Then run:

```
npm run dev
```

You should now see in the terminal a link that should run the website locally on your computer at: `http://localhost:3000`.

## Backend Components

### Database

## Frontend Components

### Pages

#### Profile Page

View your account details and edit account information such as your name, email, or password.

#### Register Page

Choose to register either a player or team account and input the corresponding information needed to create an account.

#### Sign In Page

Input the account username or email and the corresponding password to access your account with its provided permissions.

#### Team Page

View your team's roster, send join requests from a player account, or accept/deny join requests from a team account.

#### Standings Page

View the league's standings and sort by wins, losses, etc.

#### Schedule Page

View the league schedule, your team's schedule, and send reschedule requests as a team account to an opposing team.

#### Home Page

View general league information and announcements sent by a commissioner to the league

## FAQ
