# build and config environment
FROM keymetrics/pm2:14-alpine
WORKDIR /app
COPY . .

# Install dependencies 
RUN yarn global add pm2
RUN pm2 install pm2-logrotate
RUN yarn install --network-timeout 100000
RUN yarn build

ARG PORT

EXPOSE $PORT

RUN mkdir -p /app/logs

RUN ln -sf /proc/1/fd/1 /app/logs/info.log \
    && ln -sf /proc/1/fd/2 /app/logs/error.log \
    && ln -sf /proc/1/fd/1 /app/logs/debug.log

# RUN
CMD sh postgres.loading.sh postgres-users