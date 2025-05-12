FROM ghcr.io/puppeteer/puppeteer:latest

# Set working directory
WORKDIR /app

# Copy your app files
COPY . .

# Install dependencies
RUN npm install

# Set environment variable to disable Chromium sandbox
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Run with proper Puppeteer launch flags
EXPOSE 8080
CMD ["node", "index.js"]
