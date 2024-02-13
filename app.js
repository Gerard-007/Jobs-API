require('dotenv').config();
require('express-async-errors')

// Extra Security Packages...
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

// Swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDoc = YAML.load('./swagger.yaml')

// Instantiate Server
const express = require('express');
const app = express();

// Import auth user middleware
const authUser = require('./middleware/authentication');

// Import Connect DB
const connectDB = require('./db/connect')

// Import Routers
const authRouter = require('./routes/auth');
const jobRouter = require('./routes/jobs')

// Import error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1)

app.use(express.json());
// Extra packages here...
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests/windowMs
}))

// Main Home
app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1> <a href="/api-doc">Documentation</a>');
})

// Api Doc
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerDoc))

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authUser, jobRouter)

// middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// port
const port = process.env.PORT || 3000;

// start server
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();