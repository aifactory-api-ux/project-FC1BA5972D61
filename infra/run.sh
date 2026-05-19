#!/bin/bash
set -e

command -v docker >/dev/null 2>&1 || {
    echo "Docker is not installed" >&2
    exit 1
}

command -v docker-compose >/dev/null 2>&1 || {
    echo "Docker Compose is not installed" >&2
    exit 1
}

cd "$(dirname "$0")"

echo "Building and starting services..."
docker-compose up --build -d

echo "Waiting for services to be healthy..."
timeout=120
interval=5
elapsed=0

while [ $elapsed -lt $timeout ]; do
    auth_healthy=$(docker inspect --format='{{.State.Health.Status}}' infra-auth-service-1 2>/dev/null || echo "none")
    frontend_healthy=$(docker inspect --format='{{.State.Health.Status}}' infra-frontend-1 2>/dev/null || echo "none")

    if [ "$auth_healthy" = "healthy" ] && [ "$frontend_healthy" = "healthy" ]; then
        echo ""
        echo "All services are healthy!"
        echo "Frontend available at http://localhost:3000"
        echo "Backend available at http://localhost:23001"
        exit 0
    fi

    echo -n "."
    sleep $interval
    elapsed=$((elapsed + interval))
done

echo ""
echo "Timeout waiting for services to be healthy"
docker-compose logs
exit 1