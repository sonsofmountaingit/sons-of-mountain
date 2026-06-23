#!/bin/sh
# Ensure the media volume is writable by the nextjs user
chown -R nextjs:nodejs /app/public/media 2>/dev/null || true
exec su-exec nextjs node server.js
