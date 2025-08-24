# Use Node.js 24 Alpine for smaller image size
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files and source code
COPY package*.json ./
COPY tsconfig.json ./
COPY src/ ./src/

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Build the project
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm ci --only=production && npm cache clean --force

# Create non-root user for security
RUN addgroup -g 1001 -S mcpuser && \
    adduser -S mcpuser -u 1001 -G mcpuser

# Change ownership of app directory
RUN chown -R mcpuser:mcpuser /app

# Switch to non-root user
USER mcpuser

# Expose port for MCP server
EXPOSE 3000

# Default environment variables
ENV NODE_ENV=production
ENV FRONIUS_HOST=fronius-inverter
ENV FRONIUS_PORT=80
ENV FRONIUS_PROTOCOL=http
ENV FRONIUS_TIMEOUT=10000
ENV FRONIUS_DEVICE_ID=1
ENV FRONIUS_RETRIES=3
ENV FRONIUS_RETRY_DELAY=1000
ENV LOG_LEVEL=info

# Health check - test if server process is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD ps aux | grep -v grep | grep 'node dist/server.js' || exit 1

# Start the server in stdio mode (use docker exec for MCP communication)
CMD ["node", "dist/server.js"]