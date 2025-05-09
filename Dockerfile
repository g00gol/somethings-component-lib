# Use official Expo image based on Node
FROM node:20

# Install expo CLI globally
RUN npm install -g expo-cli

# Set workdir
WORKDIR /app

# Copy project files
COPY . .

# Install deps
RUN npm install

# Expose dev ports: Metro + Tunnel/WebSocket
EXPOSE 8081 19000 19001

# Default command
CMD ["expo", "start", "--tunnel"]
