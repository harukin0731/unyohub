#!/bin/sh
set -eu
if [ ! -f /tmp/unyohub-msmtp.conf ]; then
    echo 'SMTP is not configured' >&2
    exit 1
fi
exec msmtp --file=/tmp/unyohub-msmtp.conf "$@"
