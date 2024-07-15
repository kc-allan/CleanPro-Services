Here's a more detailed README that explains how to run the project locally:

---

# React + Flask Cleaning Services Platform

## Overview
This platform connects professional cleaners to clients in Nairobi, providing an easy, efficient, and affordable way to book cleaning services. Cleaners can showcase their skills and work ethic on detailed profiles, including ratings from previous jobs, while clients can book services with confidence.

## Features
- **Cleaner Profiles:** Detailed profiles for cleaners including their skills, work history, and ratings.
- **Booking Services:** Clients can easily book cleaning services.
- **Efficiency:** Streamlined process for booking and managing cleaning services.
- **Affordability:** Competitive pricing for cleaning services.

## Tech Stack
- **Frontend:** React
- **Backend:** Flask
- **Database:** SQLite (for local development)
				MySQL (for production)

## Prerequisites
- **Node.js & npm:** Ensure you have Node.js and npm installed. You can download them from [here](https://nodejs.org/).
- **Python:** Ensure you have Python installed. You can download it from [here](https://www.python.org/).
- **Virtualenv:** It's recommended to use virtual environments for Python projects. You can install it using `pip install virtualenv`.

## Setup

### Backend (Flask)
1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/cleaning-services-platform.git
    cd backend
    ```

2. **Set up a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install the required packages:**
    ```bash
    pip install -r requirements.txt
    ```

4. **Set up the database:**
    ```bash
    flask db init
    flask db migrate -m "Initial migration."
    flask db upgrade
    ```

5. **Run the backend server:**
    ```bash
    flask run
    ```
    The backend server will start on `http://127.0.0.1:5000`.

### Frontend (React)
1. **Navigate to the frontend directory:**
    ```bash
    cd client
    ```

2. **Install the required packages:**
    ```bash
    npm install
    ```

3. **Start the frontend server:**
    ```bash
    npm start
    ```
    The frontend server will start on `http://localhost:3000`.

## Running the Project Locally
1. **Start the backend server (Flask):** Follow the instructions in the Backend section above.
2. **Start the frontend server (React):** Follow the instructions in the Frontend section above.
3. **Access the application:** Open your web browser and go to `http://localhost:3000`.

## Directory Structure
```
CleanPro-Services/
.
├── backend
│   ├── alembic.ini
│   ├── app
│   │   ├── admin.py
│   │   ├── __init__.py
│   │   ├── models
│   │   │   ├── base_model.py
│   │   │   ├── booking.py
│   │   │   ├── engine
│   │   │   │   ├── db_storage.py
│   │   │   │   ├── __init__.py
│   │   │   │   └── __pycache__
│   │   │   │       ├── db_storage.cpython-312.pyc
│   │   │   │       └── __init__.cpython-312.pyc
│   │   │   ├── __init__.py
│   │   │   ├── payment_method.py
│   │   │   ├── payment.py
│   │   │   ├── __pycache__
│   │   │   │   ├── base_model.cpython-312.pyc
│   │   │   │   ├── booking.cpython-312.pyc
│   │   │   │   ├── __init__.cpython-312.pyc
│   │   │   │   ├── payment.cpython-312.pyc
│   │   │   │   ├── payment_method.cpython-312.pyc
│   │   │   │   ├── review.cpython-312.pyc
│   │   │   │   ├── role.cpython-312.pyc
│   │   │   │   ├── service.cpython-312.pyc
│   │   │   │   └── user.cpython-312.pyc
│   │   │   ├── review.py
│   │   │   ├── role.py
│   │   │   ├── service.py
│   │   │   └── user.py
│   │   ├── __pycache__
│   │   │   ├── admin2.cpython-312.pyc
│   │   │   ├── admin.cpython-312.pyc
│   │   │   └── __init__.cpython-312.pyc
│   │   ├── routes
│   │   │   ├── bookings.py
│   │   │   ├── main
│   │   │   │   ├── errors.py
│   │   │   │   ├── __init__.py
│   │   │   │   ├── __pycache__
│   │   │   │   │   ├── errors.cpython-312.pyc
│   │   │   │   │   ├── __init__.cpython-312.pyc
│   │   │   │   │   └── views.cpython-312.pyc
│   │   │   │   └── views.py
│   │   │   ├── payments.py
│   │   │   ├── __pycache__
│   │   │   │   ├── bookings.cpython-312.pyc
│   │   │   │   ├── payments.cpython-312.pyc
│   │   │   │   ├── reviews.cpython-312.pyc
│   │   │   │   └── services.cpython-312.pyc
│   │   │   ├── reviews.py
│   │   │   └── services.py
│   │   ├── static
│   │   │   ├── images
│   │   │   │   └── 404.gif
│   │   │   ├── input.css
│   │   │   ├── scripts
│   │   │   └── styles.css
│   │   ├── tailwind.config.js
│   │   └── templates
│   │       ├── admin
│   │       │   ├── 404.html
│   │       │   ├── dashboard.html
│   │       │   ├── login.html
│   │       │   ├── signup.html
│   │       │   └── user_report.html
│   │       ├── custom_list.html
│   │       └── forms
│   │           ├── create_booking.html
│   │           ├── create_service.html
│   │           └── create_user.html
│   ├── config.py
│   ├── data-dev.sqlite
│   ├── migrations
│   │   ├── env.py
│   │   ├── __pycache__
│   │   │   └── env.cpython-312.pyc
│   │   ├── README
│   │   ├── script.py.mako
│   │   └── versions
│   │       ├── 3c3eedb25269_migrations.py
│   │       ├── 59222f025664_migrations.py
│   │       ├── 78d9dfd21751_migrations.py
│   │       ├── dc6fa0afd85f_migrations.py
│   │       └── __pycache__
│   │           ├── 3c3eedb25269_migrations.cpython-312.pyc
│   │           ├── 59222f025664_migrations.cpython-312.pyc
│   │           ├── 78d9dfd21751_migrations.cpython-312.pyc
│   │           └── dc6fa0afd85f_migrations.cpython-312.pyc
│   ├── mysql-dev-setup.sql
│   ├── __pycache__
│   │   ├── config.cpython-312.pyc
│   │   └── server.cpython-312.pyc
│   ├── requirements.txt
│   ├── server.py
│   └── test.py
├── client
│   ├── jsconfig.json
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── assets
│   │   │   ├── linkedin.png
│   │   │   └── twitter.png
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src
│   │   ├── App.js
│   │   ├── components
│   │   │   ├── 404Page.jsx
│   │   │   ├── AppAppBar.jsx
│   │   │   ├── BookServiceDialog.jsx
│   │   │   ├── CustomRating.jsx
│   │   │   ├── DatePicker.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── FlexBetween.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Highlights.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── ToggleColorMode.jsx
│   │   │   └── WidgetWrapper.jsx
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── scenes
│   │   │   ├── homePage
│   │   │   │   └── index.jsx
│   │   │   ├── landingPage
│   │   │   │   └── index.jsx
│   │   │   ├── loginPage
│   │   │   │   └── index.jsx
│   │   │   ├── profilePage
│   │   │   │   └── index.jsx
│   │   │   ├── signupPage
│   │   │   │   └── index.jsx
│   │   │   └── widgets
│   │   │       ├── AccountManagement.jsx
│   │   │       ├── AddPaymentMethod.jsx
│   │   │       ├── AvailableJobs.jsx
│   │   │       ├── Bookings.jsx
│   │   │       ├── Reviews.jsx
│   │   │       ├── Title.jsx
│   │   │       ├── UserWidget.jsx
│   │   │       ├── ViewBooking.jsx
│   │   │       └── WorkerBookingsDialog.jsx
│   │   ├── state
│   │   │   └── index.js
│   │   └── theme.js
│   └── tailwind.config.js
└── README.md

└── ...
```

## Contributing
1. **Fork the repository:**
    - Click on the "Fork" button at the top right corner of the repository page.

2. **Clone your fork:**
    ```bash
    git clone https://github.com/kc-allan/CleanPro-Services.git
    cd cleaning-services-platform
    ```

3. **Create a branch for your feature:**
    ```bash
    git checkout -b feature-name
    ```

4. **Make your changes and commit them:**
    ```bash
    git commit -m "Description of the feature or fix"
    ```

5. **Push your changes to your fork:**
    ```bash
    git push origin feature-name
    ```

6. **Create a pull request:**
    - Go to the original repository and click on the "New pull request" button.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
If you have any questions or need further assistance, feel free to contact us at [kiruiallan401@gmail.com](mailto:your-email@example.com).

---
