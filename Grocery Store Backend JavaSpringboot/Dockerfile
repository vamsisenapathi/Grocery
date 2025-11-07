# Use OpenJDK 21 as the base image (since JDK 25 is not yet widely available in Docker images)
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built JAR file
COPY target/grocery-backend.jar grocery-backend.jar

# Expose the application port
EXPOSE 8080

# Set JVM options for optimal performance
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar grocery-backend.jar"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/v1/actuator/health || exit 1