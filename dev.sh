#!/bin/bash

echo "🧹 Cleaning up ports..."
kill -9 $(lsof -t -i:3000) 2>/dev/null || true

echo "🚀 Starting Tauri..."
bun run tauri:dev