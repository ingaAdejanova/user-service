# Use official Node.js Alpine image for version 18
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock (if present) to container
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["yarn", "start"]
