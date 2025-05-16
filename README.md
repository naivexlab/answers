
## Demo

### spin up services (would take a min)

    https://answers-aiservice.onrender.com
    https://answers-backend.onrender.com

    website:
    https://answers-1gpx.onrender.com
    

## Build and Run

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

    docker stop aiservice; docker rm aiservice;
    docker run -d --name aiservice -p 5000:5000 --env-file aiservice/.env -e PYTHON_ENV=prod aiservice_image

    docker stop backendservice; docker rm backendservice
    docker run -d --name backendservice -p 4000:4000 --env-file backend/.env backendservice_image

    docker stop frontendservice; docker rm frontendservice
    docker run -d --name frontendservice -p 3000:80 --env-file frontend/.env frontend_image

### View Logs
    docker logs -f aiservice
    docker logs -f backendservice


## Further Details

### Deployment instructions

    Use render.yaml /vercel.json files to deploy from pc, or can deploy individual services through cloud providers (render) by giving build and run commands with env variables set.

    Automate deployments by linking to github CI/CD on render/vercel 

### Architectural trade-offs
    
    No Auth has been implemented, allowing anyone to create quizes and create/take multiple quizzes leading to misuse and security concern

    Rate Limiting is also not implemented, further compromising the misuse and bots. A significant blunder could be of llm apis being used in aiservice, which could increase costs if not regulated.

    Scaling the system is costly and not feasible with current configuration of render/vercel, over traditional cloud providers or k8s. System design could be improved.

### List of Unit/Integration Tests

    Frontend
    Unit Tests: 
        QuizComponent: 
            1. Verify whether component renders with diff props, states
            2. Tets Mock Api calls and how the component handles the behaviour and errors
            3. Test state updates correctly to user interactions, response data, with different configs of questions and options ui
        
        SnackNotificaton: Verify notifications are displayed based on different response/events
    Integration Tests:
        apiService: Test integration bw frontend and backend apis, Mock the backend
        QuizComponent: Test interaction bw different sub components
    
    Backend
    Unit Tests:
        QuizController:
            1. Test how controller handles generate and grade requests
            2. Mock service layer and test controller logic
        llmService: Test data processing, json parsing of llm response
    
        Unit tests for utility functions: logger, mongoclient, 
        Unit tests for schema validation, data validation of request, response models 

    Integration Tests:
        db: test integration with the database, test with qa/test databse

    AIService
    Unit Tests:
        llm: test different llms request response
        utils: test utils like logger etc.
    
    Integration Tests:
        api: Test api endpoints and response format
        