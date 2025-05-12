// --------------------
// FILE: Dockerfile
// --------------------
FROM node:20-bullseye

# Install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy code
COPY . .

# Expose port and run
EXPOSE 8080
CMD [ "npm", "start" ]
