const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const { getUserById } = require('../db')
const { JWT_SECRET = 'mySecret' } = process.env
const twoCents = {
  health: "Healthy because it's a 2 instead of a 5",
  uptime: process.uptime(),
  message: "Doing excellent",
  date: new Date()
  }
  
router.get('/health', async (req, res, next) => {
  res.status(200).send(twoCents)
});


// Validate, and set "req.user" for logged in actions
router.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  if (!auth) { 
      next();
  } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
      try {
          const parsedToken = jwt.verify(token, JWT_SECRET);   
          const id = parsedToken && parsedToken.id
          if (id) {
              req.user = await getUserById(id);
              next();
          }
      } catch (error) {
          next(error);
      }

  } else {
      next({
          name: 'AuthorizationHeaderError',
          message: `Authorization token must start with ${ prefix }`
      });
  }
});

router.use((req, res, next) => {
  if (req.user) {
  }
  next();
});

const productsRouter = require('./products');
router.use('/products', productsRouter);

const usersRouter = require('./users');
router.use('/users', usersRouter);

const ordersRouter = require('./Orders');
router.use('/orders', ordersRouter);

const cartRouter = require('./cart');
router.use('/cart', cartRouter);


module.exports = router;

