# Build stage
FROM maven:3.9.6-eclipse-temurin-17-focal AS build
WORKDIR /app

# Copy the whole project
COPY . .

# Build the application
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-focal
WORKDIR /app

# Copy the JAR
COPY --from=build /app/target/Project-3.1.0-SNAPSHOT.jar app.jar

# Create directory for Firebase config
RUN mkdir -p /app/firebase

# Script to write Firebase config on startup
RUN echo '#!/bin/sh\n\
echo "$FIREBASE_CONFIG" > /app/firebase/firebase-service-account.json\n\
java -jar app.jar' > /app/start.sh

RUN chmod +x /app/start.sh

ENV PORT=8080
EXPOSE ${PORT}

# Use the start script instead of directly running the jar
CMD ["/app/start.sh"]
