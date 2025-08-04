# 🎯 MCQ Quiz App - Frontend

This is the frontend of the MCQ Quiz App, built using React + Vite. It interacts with the backend API to provide a smooth, responsive, and interactive quiz experience for users and administrators.

---

## 🚀 Features

- 🔐 User Authentication (Sign Up, Login, Forgot/Reset Password)
- 👥 Role-Based Access (User/Admin)
- ❓ Create & Take Exams with MCQs
- 📊 Score Calculation & Exam History
- ⚡️ Dynamic UI with Toasts and Loaders
- 📱 Responsive & Modern Design

---

## 🛠 Tech Stack

| Layer            | Tech Used                                    |
| ---------------- | -------------------------------------------- |
| Framework        | React + Vite                                 |
| Styling          | TailwindCSS + shadcn/ui (Bootstrap optional) |
| Routing          | React Router                                 |
| State Management | Redux Toolkit                                |
| HTTP Client      | Axios                                        |
| Version Control  | Git                                          |

---

## 🔧 Getting Started

### 1. Clone the Repository

git clone https://github.com/yanmyoaung2004/smartquiz-frontend.git
cd smartquiz-frontend

### 2. Install Dependencies

npm install

### 3. Configure Environment

Create a .env file in the root directory:

VITE_API_BASE_URL=http://localhost:8080
Replace the value with your backend URL.

### 4. Run the App

npm run dev

## 🧩 Core Components

Auth Pages: Login, Register, Forgot Password, Reset Password

User Dashboard: Join Exams, View History

Admin Dashboard: Create Questions, Exams, Manage Users

Exam View: Take Exam, Submit Answers

Result View: View Scores and Feedback

## 👥 Team Members

| Name                 | Role        |
| -------------------- | ----------- |
| Yan Myo Aung         | Team Leader |
| Aung Kyaw Khaing Min | Developer   |
| Hla Wutt Hmone Aye   | Developer   |
| Cherry Thet Mon      | Developer   |

# 📚 MCQ Quiz App - Backend API

This is the **backend API** of the **MCQ Quiz App**, built using **Spring Boot**. It provides RESTful endpoints to manage quizzes, questions, user scores, and authentication.

---

## 🚀 Features

- User Registration & Login
- Create & Manage Quizzes
- Multiple-Choice Questions (MCQs)
- Answer Submission & Scoring
- Admin & User Role Separation
- CORS Configured for Frontend Access

---

## 🛠 Tech Stack

- Java 17+
- Spring Boot
- Spring Data JPA
- Spring Security
- H2 / MySQL (Configurable)
- REST API
- Maven

---

## 🔧 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yanmyoaung2004/smartquiz-api.git
cd smartquiz-api
```

### 2. Setup Environment

Create an application.properties file in src/main/resources/ with your database config:

spring.datasource.url=jdbc:mysql://localhost:3306/quizdb
spring.datasource.username=your_db_user
spring.datasource.password=your_db_pass
spring.jpa.hibernate.ddl-auto=update

### 3. Run the Application

./mvnw spring-boot:run (in bash)

## 📌 API Endpoints

### 🔐 Authentication Management Module (/auth)

| Method | Endpoint           | Description               | Request Body              | Response     |
| ------ | ------------------ | ------------------------- | ------------------------- | ------------ |
| POST   | `/signup`          | Create a new user         | username, email, password | String (201) |
| POST   | `/login`           | Authenticate user         | email, password           | String (200) |
| POST   | `/forgot-password` | Send password reset email | email                     | String (200) |
| POST   | `/reset-password`  | Reset user's password     | email, newPassword, token | String (200) |
| GET    | `/validate-user`   | JWT token validation      | (Authorization Header)    | String (200) |

### 👤 User Management Module (/user)

| Method | Endpoint           | Description       | Request Body              | Response     |
| ------ | ------------------ | ----------------- | ------------------------- | ------------ |
| POST   | `/create`          | Create user       | username, email, password | String (201) |
| PUT    | `/update/{userId}` | Update user       | username, email, password | String (200) |
| GET    | `/get/{userId}`    | Get user by ID    | -                         | User (200)   |
| DELETE | `/delete/{userId}` | Delete user by ID | -                         | String (200) |

### ❓ Question Management Module (/question)

| Method | Endpoint               | Description               | Request Body   | Response       |
| ------ | ---------------------- | ------------------------- | -------------- | -------------- |
| POST   | `/create`              | Create a question         | Question       | String (201)   |
| POST   | `/create-by-batch`     | Create questions in batch | List<Question> | String (201)   |
| POST   | `/update/{questionId}` | Update question           | Question       | String (200)   |
| GET    | `/get/{questionId}`    | Get question by ID        | -              | Question (200) |
| DELETE | `/delete/{questionId}` | Delete question by ID     | -              | String (200)   |

Question Structure:

questionText, questionImage, List<Option> options, correctAnswer

Option: optionText, optionImage

### 📝 Exam Management Module (/exam)

| Method | Endpoint                  | Description              | Request Body                                       | Response           |
| ------ | ------------------------- | ------------------------ | -------------------------------------------------- | ------------------ |
| POST   | `/create`                 | Create an exam           | name, duration, startDate, List<Long> questionList | String (201)       |
| POST   | `/update/{examId}`        | Update an exam           | name, duration, startDate, List<Long> questionList | String (201)       |
| GET    | `/get/{examId}`           | Get exam by ID           | -                                                  | Exam (200)         |
| DELETE | `/delete/{examId}`        | Delete exam by ID        | -                                                  | String (200)       |
| POST   | `/{examId}/user/{userId}` | Submit exam answers      | List<QuestionAnswer>                               | Result (200)       |
| GET    | `/user/{userId}/history`  | Get exam history by user | -                                                  | List<Result> (200) |

QuestionAnswer Structure:

questionId, optionId

## 👥 Team Members

| Name                 | Role        |
| -------------------- | ----------- |
| Yan Myo Aung         | Team Leader |
| Aung Kyaw Khaing Min | Developer   |
| Hla Wutt Hmone Aye   | Developer   |
| Cherry Thet Mon      | Developer   |

## ©️ Copyright

© 2025 Yan Myo Aung, Aung Kyaw Khaing Min, Hla Wutt Hmone Aye, Cherry Thet Mon.
All rights reserved.

---
