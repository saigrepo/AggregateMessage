#!/bin/bash

# Build the application
echo "Building the application..."
./gradlew clean build -x test

# Check if the build was successful
if [ $? -ne 0 ]; then
  echo "Build failed! Exiting..."
  exit 1
fi

# Run the application
echo "Running the application..."
./gradlew bootRun
