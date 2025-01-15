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

ENV PORT=8080
EXPOSE ${PORT}

CMD ["java", "-jar", "app.jar"]
