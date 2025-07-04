FROM node:20-alpine as build-stage
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend/. .
ARG REACT_APP_BACKEND_URL=./api
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN npm run build
FROM nginx:alpine as production-stage
RUN apk add bash
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./scripts/wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh
COPY ./frontend/entrypoint.sh /usr/local/bin/frontend-entrypoint.sh
RUN chmod +x /usr/local/bin/frontend-entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/usr/local/bin/frontend-entrypoint.sh"]