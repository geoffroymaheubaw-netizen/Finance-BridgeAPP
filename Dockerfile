FROM node:20-slim

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm install

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=7860

# Build the frontend and backend server
RUN npm run build

# Expose standard Hugging Face Spaces port
EXPOSE 7860

# Start production server
CMD ["npm", "start"]
