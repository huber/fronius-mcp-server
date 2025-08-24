#!/bin/bash

# Fronius MCP Server Docker Runner
# This script makes it easy to run the Fronius MCP server in Docker

set -e

CONTAINER_NAME="fronius-mcp-server"
IMAGE_NAME="fronius-mcp-server"

# Default values
FRONIUS_HOST="${FRONIUS_HOST:-fronius-inverter.local}"
FRONIUS_PORT="${FRONIUS_PORT:-80}"
FRONIUS_PROTOCOL="${FRONIUS_PROTOCOL:-http}"

echo "🔧 Fronius MCP Server Docker Setup"
echo "======================================"

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build image if it doesn't exist
if ! docker image inspect $IMAGE_NAME >/dev/null 2>&1; then
    echo "🏗️  Building Docker image..."
    docker build -t $IMAGE_NAME .
fi

# Stop existing container if running
if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
    echo "🛑 Stopping existing container..."
    docker stop $CONTAINER_NAME
fi

# Remove existing container if it exists
if docker ps -a -q -f name=$CONTAINER_NAME | grep -q .; then
    echo "🗑️  Removing existing container..."
    docker rm $CONTAINER_NAME
fi

# Start new container
echo "🚀 Starting Fronius MCP Server container..."
echo "   Fronius Host: $FRONIUS_HOST"
echo "   Protocol: $FRONIUS_PROTOCOL"
echo "   Port: $FRONIUS_PORT"

docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -e FRONIUS_HOST="$FRONIUS_HOST" \
    -e FRONIUS_PORT="$FRONIUS_PORT" \
    -e FRONIUS_PROTOCOL="$FRONIUS_PROTOCOL" \
    $IMAGE_NAME

echo "✅ Container started successfully!"
echo ""
echo "📝 Claude Desktop Configuration:"
echo "Add this to your claude_desktop_config.json:"
echo ""
echo "{"
echo "  \"mcpServers\": {"
echo "    \"fronius-solar\": {"
echo "      \"command\": \"docker\","
echo "      \"args\": [\"exec\", \"-i\", \"$CONTAINER_NAME\", \"node\", \"dist/server.js\"]"
echo "    }"
echo "  }"
echo "}"
echo ""
echo "🔍 Container Status:"
docker ps -f name=$CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "📊 View logs: docker logs -f $CONTAINER_NAME"
echo "🛑 Stop server: docker stop $CONTAINER_NAME"