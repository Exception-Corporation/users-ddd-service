# Base image
FROM node:16

# Creating a directory inside the base image and defining as the base directory
WORKDIR /app

# Copying the files of the root directory into the base directory
COPY . .

# Installing infrastructure dependencies
#####

# Installing the project dependencies
RUN yarn global add pm2
RUN yarn install --ignore-engines --network-timeout 100000
RUN yarn build

# Exposing the RestAPI port
EXPOSE 4000

# Starting the pm2 process and keeping the docker container alive
CMD sh postgres.loading.sh postgres-users