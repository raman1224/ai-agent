#!/bin/sh
# Render give PORT Gateway for use
MAIN_PORT="${PORT:-8000}"

# in services (public doesnt)
( cd /app/services/auth  && PORT=8001 MONGODB_URI="${AUTH_MONGODB_URI:-$MONGODB_URI}"  node dist/index.js ) &
( cd /app/services/chat  && PORT=8002 MONGODB_URI="${CHAT_MONGODB_URI:-$MONGODB_URI}"  node dist/index.js ) &
( cd /app/services/agent && PORT=8003 MONGODB_URI="${AGENT_MONGODB_URI:-$MONGODB_URI}" node dist/index.js ) &

# last Gateway  (main process)
cd /app/gateway && PORT="$MAIN_PORT" exec node dist/index.js