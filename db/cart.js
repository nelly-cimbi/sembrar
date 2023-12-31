const client = require('./client');

// POST /db/cart

async function createCart( {user_id, isActive}){
    try{
        const {rows} = await client.query(`
            INSERT INTO carts(user_id, isActive) VALUES ($1, $2)
            RETURNING id
        `, [user_id, isActive]);
        return rows[0];
    } catch (error) {
        throw error;
    }
  }

  async function getCartIdByUserId( {user_id} ){
    try {
        const {rows} = await client.query(`
            SELECT id
            FROM carts
            WHERE user_id = $1
        `, [user_id]);
        return rows[0];
    } catch (error) {
        throw error;
    }
  }

  async function getCartByUserId( {user_id} ){
    try {
        const {rows} = await client.query(`
            SELECT DISTINCT ON (cart_lines.product_id) carts.user_id, cart_lines.cart_id, cart_lines.product_id, cart_lines.qty, products.name, products.price, products.inventory, products.photo_id
            FROM carts
            LEFT JOIN cart_lines ON carts.id = cart_lines.cart_id
            LEFT JOIN products ON cart_lines.product_id = products.id
            WHERE carts.user_id = $1
        `, [user_id]);
        return rows;
    } catch (error) {
        throw error;
    }
  }

  async function addToCart({ cart_id, product_id, qty }) {
    try {
        const {rows: [line]} = await client.query(`
            INSERT INTO cart_lines(cart_id, product_id, qty) VALUES ($1, $2, $3)
            RETURNING id, cart_id, product_id, qty
        `, [cart_id, product_id, qty]);
        return line;
    } catch (error) {
        throw error;
    }
  }
  
  async function interpretCart( {product_id } ){
    try {
        const {rows} = await client.query(`
            SELECT DISTINCT ON (products.id) products.name, products.price, products.inventory, products.photo_id
            FROM products
            WHERE products.id = $1
        `, [product_id]);
        return rows;
    } catch (error) {
        throw error;
    }
  }
  
  async function editCart( {qty, cart_id, product_id } ){
    try {
        const {rows} = await client.query(`
            UPDATE cart_lines
            SET qty = $1
            WHERE cart_id = $2 AND product_id = $3
            RETURNING *;
        `, [qty, cart_id, product_id]);
        return rows;
    } catch (error) {
        throw error;
    }
  }
  
  async function deleteCartLine( {cart_id, product_id }){
    console.log("Receiving: ", cart_id, product_id)
    try {
        const {rows} = await client.query(`
            DELETE FROM cart_lines 
            WHERE cart_id = $1 AND product_id = $2
            RETURNING *;
        `, [cart_id, product_id]);
        return rows;
    } catch (error) {
        throw error;
    } 
  }



module.exports = {
    createCart,
    addToCart,
    getCartIdByUserId,
    deleteCartLine,
    editCart,
    interpretCart,
    getCartByUserId
}