FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port and run app
EXPOSE 8080
CMD ["npm", "start"]
