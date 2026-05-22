#!/bin/sh
set -eu

WORKER_COMMAND="${UNYOHUB_WORKER_COMMAND:-}"
WORKER_INTERVAL="${UNYOHUB_WORKER_INTERVAL:-3600}"

if [ -z "$WORKER_COMMAND" ]; then
    exec tail -f /dev/null
fi

while :; do
    su -s /bin/sh www-data -c "$WORKER_COMMAND"
    sleep "$WORKER_INTERVAL"
done

