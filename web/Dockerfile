# Use an official Node.js runtime as a parent image
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3000 for Next.js
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]
