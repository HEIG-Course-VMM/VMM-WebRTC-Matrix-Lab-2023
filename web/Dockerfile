# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app/backend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the entire application code to the working directory
COPY . .

# Expose the port that the Express.js application listens on
EXPOSE 8080

# Start the Express.js application
CMD [ "npm", "start" ]
