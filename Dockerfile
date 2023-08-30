FROM node:alpine AS build
WORKDIR /client
COPY package.json .
RUN npm i
COPY . .
RUN npm run build

FROM nginx
EXPOSE 80
COPY --from=build /client/build /usr/share/nginx/html
