# Build stage
FROM maven:3.9.6-eclipse-temurin-17-focal AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-focal
WORKDIR /app
# Copy the specific JAR file by name instead of using wildcard
COPY --from=build /app/target/YOUR_JAR_NAME.jar app.jar
ENV PORT=8080
EXPOSE ${PORT}
CMD ["java", "-jar", "app.jar"]
