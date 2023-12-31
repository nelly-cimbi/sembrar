const client = require('./client');


async function getAllOrders() {
    
    try {
      const { rows } = await client.query(
        `SELECT *
            FROM orders;
          `)
      return rows
    } catch (err) {
      console.log("error at getAllOrders")
    }
  }


async function createOrder({ first_name, last_name, user_id, email, address_line_1, address_line_2, city, state, zip, total }) {
    try {
      console.log(`first_name = ${first_name}, last_name=${last_name}, user_id=${user_id}, email=${email}, address=${address_line_1}, address2=${address_line_2}, city=${city}, state=${state}, zip=${zip}, total=${total} `)
      const {rows: [order]} = await client.query(`
        INSERT INTO orders (first_name, last_name, user_id, email, address_line_1, address_line_2, city, state, zip, total )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
      `, [first_name, last_name, user_id, email, address_line_1, address_line_2, city, state, zip, total]);
  
      return order;
    } catch (error) {
      throw error;
    }
  }

  async function createOrderLine({ order_id, product_id, price, qty, line_status }) {
    try {
      const {rows: [order]} = await client.query(`
        INSERT INTO order_lines (order_id, product_id, price, qty, line_status )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `, [order_id, product_id, price, qty, line_status]);
  
      return order;
    } catch (error) {
      throw error;
    }
  }


  async function getOrdersByOrderStatus(OrderStatus) {
    try {
      const { rows: [orders] } = await client.query(`
      SELECT *
      FROM orders
      WHERE orders=$1;
    `, [OrderStatus]);
  
      if (!orders) {
        throw {
          name: "OrderStatusNotFoundError",
          message: "Could not find the order status for that order"
        };
      }
  
      return orders;
    } catch (err) {
      console.log("error at get orders by order status")
      throw err;
    }
  }

  async function getOrdersByProductId( {id} ) {
    try {
        const {rows:orders} = await client.query(`
            SELECT * 
            FROM orders
            WHERE product_id = $1
        `, [id]);
        return orders;
    } catch (error) {
      console.log("error at get orders by product id")
        throw error;
    }
}

async function getOrdersByUser( {email} ) {
  console.log(email)
  try {
      const {rows:orders} = await client.query(`
          SELECT * 
          FROM orders
          WHERE email = $1
      `, [email]);
      return orders;
  } catch (error) {
    console.log("error at get orders by product id")
      throw error;
  }
}

  module.exports = {
    getAllOrders,
    getOrdersByOrderStatus,
    getOrdersByProductId,
    createOrder,
    getOrdersByUser,
    createOrderLine
  };

  
  