# Use an official Node.js runtime as a parent image
FROM node:alpine3.18

# Set the working directory in the container
WORKDIR /app

COPY package*.json ./

# Install Node.js dependencies
RUN npm install

COPY . .


# Expose the port that the app runs on
EXPOSE 8081

# Define the command to run your app
CMD ["npm","start"]