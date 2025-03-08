# Sandlot Website Source Code

## Environment Configuration

install chocolatey:
 - https://docs.chocolatey.org/en-us/choco/setup/
version: 2.3.0
check with: choco --version

install nvm :
 - https://github.com/coreybutler/nvm-windows
version: 1.1.12
check with: nvm --version

after install run:
 - nvm install 20.18.0
 - nvm use 20.18.0
check commands worked by running:
 - nvm current

npm version in use is 
 - 10.8.2
check with : npm --version

project was created using:
- npx create-next-app@latest

install required packages with (within sandlot folder):
    npm install

may need to install visual studio community 2022
if still having issues follow instructions from second answer of this post:
https://stackoverflow.com/questions/70315519/node-gyp-error-could-not-find-any-visual-studio-installation-to-use