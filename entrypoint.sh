#!/bin/bash
set -e

sysctl -w net.core.somaxconn=65535

python urlhandler/manage.py collectstatic --noinput

exec "$@"
