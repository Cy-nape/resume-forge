FROM node:20-slim

# Install LaTeX distribution
# Using --no-install-recommends to keep the image size somewhat manageable
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-latex-extra \
    texlive-science \
    lmodern \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Generate Prisma client and build the TypeScript code
RUN npm run build

# Expose backend port
EXPOSE 3001

# Start the production server
CMD ["npm", "start"]
