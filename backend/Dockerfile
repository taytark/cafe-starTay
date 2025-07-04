FROM node:20-alpine
RUN apk add bash
RUN apk add postgresql-client
WORKDIR /app
COPY ./backend/package.json ./
COPY ./backend/package-lock.json ./
RUN npm install
COPY ./.env ./
COPY ./backend/. .
COPY ./scripts/wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh
COPY ./backend/entrypoint.sh /usr/local/bin/backend-entrypoint.sh
RUN chmod +x /usr/local/bin/backend-entrypoint.sh
ENV PATH /app/node_modules/.bin:$PATH
EXPOSE 3001
ENTRYPOINT ["/usr/local/bin/backend-entrypoint.sh"]