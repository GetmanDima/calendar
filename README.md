# 📅 Event Calendar: Your Personal Scheduling Assistant

Welcome to **Event Calendar**, a sophisticated and intuitive web application designed to help you master your schedule. Whether it's for personal appointments, professional deadlines, or social gatherings, Event Calendar provides the tools you need to manage your time effectively.

## ✨ Key Features

-   **👤 Personalized Experience**: Secure user registration and login system ensures that your events are private and accessible only to you.
-   **🛠️ Complete Event Management**: Enjoy full control over your schedule with the ability to effortlessly **Create**, **Read**, **Update**, and **Delete events**.
-   **🔔 Built-in Reminder System**: **(Planned for a future release)** Never miss an important date again! An intelligent reminder system will soon be integrated to keep you ahead of your schedule.

## 💻 Core Technology Stack

-   **Backend**: PHP / Laravel / MySQL / Redis
-   **Frontend**: TypeScript / Vue
-   **Containerization**: Docker

## 🚀 Getting Started: Development Environment

Setting up the development environment is straightforward with Docker.

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/GetmanDima/calendar
    cd calendar
    ```

2.  **Configure Environment**:
    ```bash
    cp .env.example .env
    ```
    *You may customize database credentials and other settings inside `.env`.*

3.  **Launch Services**:
    ```bash
    docker compose up -d
    ```

4.  **Application Setup**:
    ```bash
    docker exec -it calendar_app composer run setup
    docker exec -it calendar_app php artisan db:seed
    ```

5.  **Frontend Development**:
    ```bash
    docker compose run --rm --service-ports node npm install
    docker compose run --rm --service-ports node npm run dev
    ```
    or better
    ```bash
    npm install
    npm run dev
    ```

## 🚀 Getting Started: Production Environment
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/GetmanDima/calendar
    cd calendar
    ```

2.  **Configure Environment**:
    ```bash
    cp .env.prod.example .env
    ```
    *You may customize database credentials and other settings inside `.env`.*
    *You also should fill APP_KEY in .env*

3.  **Launch Services**:
    ```bash
    docker compose -f docker-compose.prod.yml up -d --build
    docker exec -it calendar_app php artisan migrate
    ```

## 🌐 Application & Service URLs

Once the setup is complete, the following services will be available:

-   **Web Application**: [http://localhost:8000](http://localhost:8000)
-   **MySQL**: `localhost:3306`
-   **Redis**: `localhost:6379`
-   **Mailpit**: [http://localhost:8025](http://localhost:8025)

### Internal Tools

These routes are protected by Basic Authentication. Credentials can be found and updated in your `.env` file (`HTTP_BASIC_AUTH_USER` and `HTTP_BASIC_AUTH_PASSWORD`).

-   **Log Viewer**: [http://localhost:8000/log-viewer](http://localhost:8000/log-viewer)
-   **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

## 🛠️ Other Useful Commands

-   **Run backend tests**:
    ```bash
    docker exec -it calendar_app composer run test
    ```

-   **Run frontend tests**:
    ```bash
    docker compose run --rm --service-ports node npm run test
    ```
    or better
    ```bash
    npm run test
    ```

-   **Generate Model PHPDocs**:
    ```bash
    docker exec -it calendar_app composer run ide-helper
    ```

-   **Generate API Documentation**:
    To regenerate the Scribe API documentation.
    ```bash
    docker exec -it calendar_app composer run docs
    ```

-   **Run phpstan**:
    ```bash
    docker exec -it calendar_app composer run phpstan
    ```

-   **Run pint**:
    ```bash
    docker exec -it calendar_app composer run pint
    ```

-   **Run eslint**:
     ```bash
    docker compose run --rm --service-ports node npm run lint
    ```
    or better
    ```bash
    npm run lint
    ```

-   **Run prettier**:
    ```bash
    docker compose run --rm --service-ports node npm run format
    ```
    or better
    ```bash
    npm run format
    ```
