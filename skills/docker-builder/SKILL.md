# Docker Builder

## Purpose
Create a Dockerfile and build a Docker image for Mission Control.
This skill focuses on image creation, not container execution, for portability.

## When to Use
- Need to package Mission Control for deployment on a different host (e.g., the Mac Mini)
- To create a consistent, isolated build environment

## Commands

### Create Dockerfile
This command will create a basic Dockerfile in your workspace.
You may need to adjust it based on your specific Node.js version and build needs.

```bash
# Navigate to the Mission Control project root
cd /data/.openclaw/workspace/mission-control

# Create a basic Dockerfile
cat << EOF > Dockerfile
# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built artifacts from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Expose the port the app runs on
EXPOSE 3003

# Command to run the application
CMD ["npm", "start"]
EOF

echo "Dockerfile created at /data/.openclaw/workspace/mission-control/Dockerfile"
```

### Build Docker Image
This command builds the Docker image. It requires Docker to be installed and accessible.
**Note:** This skill *builds* the image. It does NOT attempt to *run* a container, to avoid issues on Hosts where Docker might be restricted. Use `docker run` separately if needed on a suitable environment.

```bash
# Navigate to the Mission Control project root
cd /data/.openclaw/workspace/mission-control

# Build the Docker image
# Replace 'leaderbydesign-mission-control' with your desired image name and tag
docker build -t leaderbydesign-mission-control:latest .

echo "Docker image 'leaderbydesign-mission-control:latest' built."
```

## Notes
- Ensure Docker is installed on the machine where you run these commands.
- The `Dockerfile` might need adjustments based on your specific Node.js version or build.
- Consider security best practices for Dockerfiles in production.
- The `docker build` command assumes Docker daemon is running and accessible.
