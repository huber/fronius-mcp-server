#!/bin/bash

# Test script for Fronius MCP Server Docker container

set -e

CONTAINER_NAME="fronius-mcp-server"

echo "🧪 Testing Fronius MCP Server Container"
echo "======================================="

# Check if container is running
if ! docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
    echo "❌ Container '$CONTAINER_NAME' is not running."
    echo "   Run './scripts/run-docker.sh' first."
    exit 1
fi

echo "✅ Container is running"

# Test MCP server communication
echo "🔄 Testing MCP server communication..."
if echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | docker exec -i $CONTAINER_NAME node dist/server.js | grep -q tools; then
    echo "✅ MCP server responds correctly"
else
    echo "❌ MCP server communication failed"
    echo "   Check container logs: docker logs $CONTAINER_NAME"
    exit 1
fi

# Show container status
echo ""
echo "📊 Container Status:"
docker ps -f name=$CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.CreatedAt}}"

echo ""
echo "🏥 Health Status:"
docker inspect $CONTAINER_NAME --format '{{.State.Health.Status}}' 2>/dev/null || echo "No health check configured"

echo ""
echo "💾 Resource Usage:"
docker stats $CONTAINER_NAME --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo ""
echo "✅ All tests passed! Container is ready for Claude Desktop."
echo "📝 Use this Claude Desktop config:"
echo ""
echo "{"
echo "  \"mcpServers\": {"
echo "    \"fronius-solar\": {"
echo "      \"command\": \"docker\","
echo "      \"args\": [\"exec\", \"-i\", \"$CONTAINER_NAME\", \"node\", \"dist/server.js\"]"
echo "    }"
echo "  }"
echo "}"