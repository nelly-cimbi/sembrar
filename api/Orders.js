const express = require('express');
const { getAllOrders, createOrder, getOrdersByProductId, getOrdersByOrderStatus, getOrdersByUser, createOrderLine} = require('../db');
const ordersRouter = express.Router();

//GET/api/orders
ordersRouter.get("/", async (req, res) => {
try{
    const orders = await getAllOrders()
    res.send(orders)
}catch (error){
    console.log("Error at ordersRouter.get-all-orders.js:api")
    next(error)
}
})

//GET/api/orders/get/:orderStatus
ordersRouter.get('get/:orderStatus', async (req, res, next) => {
    const orders = await getOrdersByOrderStatus(OrderStatus);
    try {
        res.send(orders)
    } catch (error) {
        console.log("Error at ordersRouter.get-orders-by-orderStatus.js:api")
        next(error)
    }
})

//GET/api/orders/:productId
// ordersRouter.get('/:productId', async (req, res, next) => {
//     try {
//         const {id} =req.params
//         const orders = await getOrdersByProductId(id);
//         res.send(orders)
//     } catch (error) {
//         console.log("Error at ordersRouter.get-orders-by-productId.js:api")
//         next(error)
//     }
// })

//GET /api/orders/getOrders/:email
ordersRouter.get('/getOrders/:email', async (req, res, next) => {
  try {
      const orders = await getOrdersByUser(req.params);
      res.send(orders)
  } catch (error) {
      console.log("Error at ordersRouter.get-orders-by-productId.js:api")
      next(error)
  }
})

// POST /api/Orders
ordersRouter.post('/', async (req, res, next) => {
    try {
      const { first_name, last_name, user_id, email, address_line_1, address_line_2, city, state, zip, total } = req.body;
      console.log("req: ", req.body)
      const createdOrder = await createOrder({ first_name, last_name, user_id, email, address_line_1, address_line_2, city, state, zip, total });
      if(createdOrder) {
        res.send(createdOrder);
      } else {
        next({
          name: 'FailedToCreateOrder',
          message: 'There was an error creating the order'
        })
      }
    } catch (error) {
      next(error);
    }
  });

// POST /api/Orders/OrderLine
ordersRouter.post('/OrderLine', async (req, res, next) => {
  try {
    const { order_id, product_id, price, qty, line_status } = req.body;
    const createdOrderLine = await createOrderLine({ order_id, product_id, price, qty, line_status});
    if(createdOrderLine) {
      res.send(createdOrderLine);
    } else {
      next({
        name: 'FailedToCreateOrderLine',
        message: 'There was an error creating the order line'
      })
    }
  } catch (error) {
    next(error);
  }
});

module.exports = ordersRouter;