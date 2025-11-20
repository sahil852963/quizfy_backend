require("dotenv").config();
const express = require("express");
const cors = require("cors");
const quizzes = require("./db/quizzes");
const userData = require('./db/users');
const { v4: uuid } = require('uuid');
const jwt = require("jsonwebtoken");
const routeNotFound = require("./middleware/routeNotFound.middleware");
const authVerify = require("./middleware/authVerify.middleware");

const quizRouter = require('./router/quiz.router');
// import express from 'express';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use('/quiz', quizRouter);

app.post('/auth/login', authVerify, (req, res) => {
    const { username, password } = req.body;
    // res.json({username, password})
    const isUserVerified = userData.users.some(user => user.username == username && user.password == password);
    if (isUserVerified) {
        res.status(200).json({ message: "Login Successfully!" });
    } else {
        res.status(401).json({ message: "Invalid Credentials" });
    }
})


app.post('/auth/signup', authVerify, (req, res) => {
    const { username, password } = req.body;
    const isUserPresent = userData.users.some(user => user.username == username);
    if (isUserPresent) {
        res.status(422).json({ message: "user already exits!" });
    } else {
        const newUser = {
            id: uuid(),
            username: username,
            password: password
        }
        userData.users = [...userData.users, newUser];
        const token = jwt.sign({ id: username }, process.env.SECRET_KEY);
        res.status(201).json({ message: `user created successfully -> ${username} and token -> ${token}` });
    }
})

app.use(routeNotFound);

// app.get("/quiz", (req, res) => {
//     res.send(quizzes);
// })

app.listen(PORT, () => {
    console.log("server running");
})