# Base image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Build the TypeScript code
RUN npm run compile

# # Expose the port used by the application
EXPOSE 3030

# Start the application
CMD ["node", "lib/index.js"]
