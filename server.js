// IMPORTS
const express = require('express');
const helmet = require('helmet');
const userRouter = require('./users/userRouter.js');
const postRouter = require('./posts/postRouter.js');

// SERVER
const server = express();

// GLOBAL MIDDLEWARE
server.use(express.json());
server.use(helmet());
server.use(logger);

// ROUTERS
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

// GLOBAL MIDDLEWARE FUNCTIONS
function logger(req, res, next) {
console.log(`Request: ${req.method} | To: ${req.url}`);
next()
}

module.exports = server;
