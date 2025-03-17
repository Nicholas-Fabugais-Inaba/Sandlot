# Setup
Python verison:
    3.13.0
check with: python --version
download here: https://www.python.org/downloads/

pip version:
    24.3.1
check with: pip --version
comes pre-installed with python

install pipenv using:
    pip install pipenv --user
check with: pipenv --version
pipenv version: 2024.4.0
documentation: https://pipenv.pypa.io/en/latest/installation.html

NOTE: if any installation is not working try closing and opening terminal/vscode

install required packages with:
    pipenv install

run fastapi server with:
    fastapi dev main.py
within the "app" folder

# Queries
Queries to the database are in the app/db/queries directory
Queries are organized into different files based on which table in the database they interact with