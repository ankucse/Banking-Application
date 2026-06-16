@echo off
echo Starting Docker databases...
docker-compose up -d

echo Waiting for databases to initialize...
timeout /t 5 /nobreak > NUL

echo Starting Spring Boot Microservices...
start "API Gateway" cmd /c "cd api-gateway && ..\gradlew bootRun"
start "Auth Service" cmd /c "cd auth-service && ..\gradlew bootRun"
start "Onboarding Service" cmd /c "cd onboarding-service && ..\gradlew bootRun"
start "Notification Service" cmd /c "cd notification-service && ..\gradlew bootRun"
start "Customer Service" cmd /c "cd customer-service && ..\gradlew bootRun"
start "Ledger Service" cmd /c "cd ledger-service && ..\gradlew bootRun"
start "Payment Service" cmd /c "cd payment-service && ..\gradlew bootRun"
