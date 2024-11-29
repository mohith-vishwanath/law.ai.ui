# Step 1: Use an official Node.js image to build the Angular app
FROM node:20.17.0 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install dependencies (including Angular CLI)
RUN yarn install

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the rest of the Angular application
COPY . .

# Build the Angular app for production
RUN ng build --configuration production

#TEST
RUN ls -l /app/dist/theprecedent

# Step 2: Use Nginx to serve the app
FROM nginx:alpine

# Copy the custom Nginx config file into the container
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built Angular app from the build stage to Nginx
COPY --from=build /app/dist/theprecedent /usr/share/nginx/html

# Copy SSL certificates into the container
# Replace these paths with the correct paths to your SSL certificates
COPY ./fullchain1.pem /etc/ssl/certs/fullchain.pem
COPY ./privkey1.pem /etc/ssl/private/privkey.pem


# Expose port 443 for HTTPS access
EXPOSE 443
EXPOSE 80

# Run Nginx to serve the app over HTTPS
CMD ["nginx", "-g", "daemon off;"]