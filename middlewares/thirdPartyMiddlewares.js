const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const limiter = rateLimit({
    windowMs: 15*60*1000,
    max: 100,   
});

module.exports = (app) =>{
    app.use(cors());
    helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts
          },
        },
      })
    app.use(morgan("dev"));
    app.use(limiter);
    app.use(cookieParser());
};