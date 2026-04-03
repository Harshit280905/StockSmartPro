const express = require('express');
const exceptionRouter = express.Router();

exceptionRouter.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  });

module.exports = exceptionRouter; 
  