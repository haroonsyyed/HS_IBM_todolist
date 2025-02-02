# IBM Full Stack Capstone Project - To-Do List

A full stack web application for users to manage their tasks with a clean and simple interface.

## Why I built this project: 

This To-Do List application allows users to create, edit, delete, and organize their tasks. Users can filter tasks by completion status, sort them alphabetically, and paginate through their list for better task management. The application includes secure user authentication, as well as a responsive-front end and a scalable back-end.

---

## Technologies Used: 
### Frontend: 
- HTML, CSS, JavaScript
### Backend: 
- Django, Django REST Framework
### Other Tools: 
- JWT for secure user authentication
- SQLite for storing user and task data

---

## Features Implemented: 
- User Authentication – Secure login, registration, and logout functionality
- Task Management – Create, edit, mark as complete, delete tasks
- Filtering & Sorting – Sort tasks alphabetically and filter by completion status
- Pagination – Efficiently load and navigate tasks
- Responsive UI – Designed with a clean layout for usability

---

## Stretch Features I would like to implement: 
- Improved Start Page for Logged-In Users – Create a better page that users will see if they are logged in but not on the login or register page, improving navigation and user experience

---

### Getting Started

1. Clone the repository.

    ```shell
    git clone github.com/haroonsyyed/HS_IBM_todolist.git
    ```

2. Navigate to the backend directory.

    ```shell
    cd todo-app-backend
    ```

3. Set up and activate a virtual environment.

    ```shell
    python -m venv env
    source env/bin/activate  # On Windows, use `env\Scripts\activate`
    ```

4. Install dependencies.

    ```shell
    pip install -r requirements.txt
    ```

5. Run database migrations.

    ```shell
    python manage.py makemigrations
    python manage.py migrate
    ```

6. Start the development server.

    ```shell
    python manage.py runserver
    ```

7. Navigate to the frontend directory.

    ```shell
    cd todo-app-frontend
    ```

2. Serve the frontend files.

    ```shell
    npx serve .
    ```
    
