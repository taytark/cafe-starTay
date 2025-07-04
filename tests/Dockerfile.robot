FROM python:3.9-slim-buster

# Set the working directory in the container
WORKDIR /app

# Install Robot Framework and necessary libraries
RUN pip install robotframework robotframework-requests robotframework-seleniumlibrary webdriver_manager

# Install Node.js and Knex for running migrations/seeds in the test container
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g knex

COPY ./scripts/wait-for-it.sh /usr/local/bin/wait-for-it.sh

# Give execute permissions to the script
RUN chmod +x /usr/local/bin/wait-for-it.sh

COPY ./tests/ ./tests/

COPY ./backend/knexfile.js ./backend/knexfile.js
COPY ./backend/src/migrations/ ./backend/src/migrations/
COPY ./backend/src/seeds/ ./backend/src/seeds/