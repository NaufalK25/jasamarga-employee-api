# Use Node.js base image
FROM node:22-alpine

# Set working directory inside container
WORKDIR /app

# Copy only the Express app folder
COPY PROJECT_FOLDER/ ./

# Install dependencies
RUN npm install

# Expose port
EXPOSE 5000

# Run the app
CMD ["node", "index.js"]