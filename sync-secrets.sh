#!/bin/bash

# Path to your dev vars file
ENV_FILE=".env.local"

# Check if .dev.vars exists
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Error: $ENV_FILE not found in the current directory."
  exit 1
fi

echo "🚀 Starting to upload secrets from $ENV_FILE..."

# Read the file line by line
while IFS= read -r line || [ -n "$line" ]; do
  # Skip empty lines and lines starting with #
  [[ -z "$line" || "$line" =~ ^# ]] && continue

  # Split into key and value at the first '='
  key="${line%%=*}"
  value="${line#*=}"

  # Strip any potential surrounding quotes from the value
  value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")

  echo "🔒 Uploading secret: $key..."
  
  # Pipe the value into wrangler to avoid it showing up in process logs
  echo -n "$value" | npx wrangler pages secret put "$key"

done < "$ENV_FILE"

echo "✨ All secrets processed!"