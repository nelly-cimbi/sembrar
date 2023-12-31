const client = require('./client');

async function getReviewsByProductId( {id} ) {
    try {
        const {rows:[reviews]} = await client.query(`
            SELECT * FROM reviews
            WHERE product_id = $1
        `, [id]);
        return reviews;
    } catch (error) {
        throw error;
    }
}

async function destroyReview(userId) {
    try {
      const {rows: [review]} = await client.query(`
          DELETE FROM reviews 
          WHERE id = $1
          RETURNING *;
      `, [userId]);
      return review;
    } catch (error) {
        console.log("error at delete reviews by user Id")
      throw error;
    }
  }

async function postReview({ product_id, user_id, review, rating }) {
    try {
        const {rows: [newReview]} = await client.query(`
            INSERT INTO reviews(product_id, user_id, review, rating) VALUES ($1, $2, $3, $4)
            RETURNING id, product_id, user_id, review, rating
        `, [product_id, user_id, review, rating]);
        return newReview;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getReviewsByProductId,
    postReview,
    destroyReview
};