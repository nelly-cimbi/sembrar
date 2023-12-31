const express = require('express');
const cartRouter = express.Router();
const { requireUser } = require('./utils');
const { getCartIdByUserId, createCart, addToCart, getCartByUserId, interpretCart, deleteCartLine, editCart } = require('../db');

  // POST /api/cart/addToCart
  cartRouter.post('/addToCart', requireUser, async (req, res, next) => {
    try {
        const {user_id, product_id, qty} = req.body;
        let cartToUpdate = await getCartIdByUserId({user_id});
        if (!cartToUpdate){
            cartToUpdate = await createCart({user_id, isActive: true});
        }
        const cartLine = await addToCart({cart_id: cartToUpdate.id, product_id: product_id, qty: qty})
        res.send(cartLine)
    } catch (error) {
        next(error);
    }
});

// GET /api/cart/cart/:user_id
cartRouter.get('/cart/:user_id', async (req, res, next) => {
  try {
      const cart = await getCartByUserId({user_id: req.params.user_id});
      console.log("Cart! ", cart)
      if(cart[0].cart_id != null) {
          res.send(cart);
          console.log("Cart! ", cart)
      } else {
          next({
          name: 'NotFound',
          message: `No cart for user_id ${req.params.user_id}`
      })
  }
  } catch (error) {
      next(error);
  }
});

// PATCH /api/cart/EditCart/
cartRouter.patch('/EditCart', requireUser, async (req, res, next) => {
  try {
      const {user_id, product_id, qty} = req.body;
      let cartToUpdate = await getCartIdByUserId({user_id});
      const cartLine = await editCart({qty: qty, cart_id: cartToUpdate.id, product_id: product_id })
      res.send(cartLine)
  } catch (error) {
      next(error);
  }
});

// DELETE /api/cart/EditCart/RemoveLine
cartRouter.delete('/RemoveLine', requireUser, async (req, res, next) => {
  try {
      const {user_id, product_id} = req.body;
      let cartToUpdate = await getCartIdByUserId({user_id});
      const cartLine = await deleteCartLine({cart_id: cartToUpdate.id, product_id: product_id })
      res.send(cartLine)
  } catch (error) {
      next(error);
  }
});

// POST /api/cart/guest-cart
cartRouter.post('/guest-cart', async (req, res, next) => {
  try {
      const {product_id} = req.body;
      let cart = await interpretCart({product_id});
      res.send(cart)
  } catch (error) {
      next(error);
  }
});

module.exports = cartRouter;