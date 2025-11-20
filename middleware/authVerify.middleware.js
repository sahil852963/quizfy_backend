const express = require('express');
const jwt = require("jsonwebtoken");

const authVerify = (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        if (decodedToken) {
            req.user = { userId: decodedToken.id }
            return next();
        }
    } catch (err) {
        console.error(`Error in verifying auth token: ${err}`);
    }
}

module.exports = authVerify;