## Build and Run AI Service

This document provides instructions on how to build and run the AI service using Docker.

### Prerequisites

* Docker installed on your system.
* Add enviroment variables / .env files

### Build

1.  Navigate to the project root directory.
2.  Build the Docker image using the following command:

    ```bash
    docker build -t aiservice_image aiservice/.

    docker build -t backendservice_image backend/.

    docker build -t frontend_image frontend/.
    ```

### Kill & Run

    ```bash
    docker stop aiservice; docker rm aiservice;
    docker run -d --name aiservice -p 5000:5000 --env-file aiservice/.env -e PYTHON_ENV=prod aiservice_image

    docker stop backendservice; docker rm backendservice
    docker run -d --name backendservice -p 4000:4000 --env-file backend/.env backendservice_image

    docker stop frontendservice; docker rm frontendservice
    docker run -d --name frontendservice -p 3000:80 --env-file frontend/.env frontend_image
    ```

### View Logs
    ```bash
    docker logs -f aiservice
    docker logs -f backendservice
    ```