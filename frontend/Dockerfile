FROM node:19-alpine AS development

ENV NODE_ENV development

# Add a work directory
WORKDIR /app

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

#Copy app files
COPY . .

# Start the app
CMD [ "npm", "run", "dev" ]