const express = require('express');
const { destroyReview} = require('../db');
const reviewsRouter = express.Router();

//Delete review by userId

reviewsRouter.delete('/:userId', requireUser, async (req, res, next) => {
    try {
    
        const deletedReview = await destroyReview(req.params.userId)
        res.send({success: true, ...deletedReview});

    } catch (error) {
        console.log("Error at reviewsRouter.delete-review-by- userId.js:api")
      next(error);
    }
  });
  
  module.exports = reviewsRouter;