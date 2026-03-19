# Interactive Quiz Platform

A full-stack web application that allows users to participate in quizzes and create, modify, or delete their own quizzes with an intuitive interface.

## Features

### User Management
- Secure user authentication with JWT
- User registration and login
- Account management and profile updates
- Password encryption and security

### Quiz Features
- Create, edit, and delete quizzes
- Add, edit, and remove quiz questions
- Set correct answers for each question
- Browse and take quizzes
- Retake quizzes multiple times

### Score Tracking
- Track scores for each quiz attempt
- View quiz history and performance
- Get instant feedback on answers
- View detailed results and statistics

## Technologies Used

### Frontend
- React
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Token)

### Tools
- Git
- GitHub

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

## API Endpoints

### Authentication
POST /api/auth/register - Register new user  
POST /api/auth/login - User login  

### Quizzes
GET /api/quizzes - Get all quizzes  
POST /api/quizzes - Create quiz  
PUT /api/quizzes/:id - Update quiz  
DELETE /api/quizzes/:id - Delete quiz  

### Questions
POST /api/quizzes/:id/questions - Add question  
PUT /api/questions/:id - Update question  
DELETE /api/questions/:id - Delete question  

### Scores
POST /api/scores - Submit quiz  
GET /api/scores - Get user scores  

### Users
GET /api/users/profile - Get profile  
PUT /api/users/profile - Update profile  

---


## 👩‍💻 Author

**Ons Elfekih**  
IT Engineering Student — Business Intelligence  
🔗 [LinkedIn](https://www.linkedin.com/in/ons-elfekih) · [Portfolio](https://portfolio-elfekih-ons.vercel.app/)

---

## 📄 License

This project is for academic and portfolio purposes.
