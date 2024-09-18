FROM node:20.15.1

WORKDIR /app
COPY ./build/hawaii-volunteer.tar.gz .
RUN mkdir -p ./build && tar -xzf hawaii-volunteer.tar.gz -C ./build

ENV MONGO_URL='mongodb://127.0.0.1:27017/volunteer'
ENV ROOT_URL='http://www.micahtilton.com'
ENV PORT=3000
EXPOSE $PORT

WORKDIR /app/build/bundle/programs/server
RUN npm install

WORKDIR /app/build/bundle

CMD ["node", "main.js"]