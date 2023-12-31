const client = require('./client');

async function getAllProducts(){
    try {
        const {rows} = await client.query(`
        SELECT * FROM products;
        `);

        return rows;
    }catch (error){
        throw error;
    }
}

async function getProductById(id){
    console.log("DB id",id)
    try {
        const {rows} = await client.query(`
        SELECT * FROM products
        WHERE id = $1;
        `, [id]);
        return rows;
    }catch (error){
        throw error;
    }
}

async function getAllActiveProducts(){
    try {
        const {rows} = await client.query(`
        SELECT * FROM products
        WHERE active=true;
        `);

        return rows;
    }catch (error){
        throw error;
    }
}

async function createProduct( {name, short_desc, long_desc, category_name, price, qty, featured, active, inventory, product_tag, photo_id }){
    console.log("active from creatProuct API DB", active)
    try {
        const {rows: [product]} = await client.query(`
            INSERT INTO products ("name", "short_desc", "long_desc", "category_name", "price", "qty", featured, active, "inventory", "product_tag", "photo_id")VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
        `, [name, short_desc, long_desc, category_name, price, qty, featured, active, inventory, product_tag, photo_id ]);

        return product;
    }catch (error){
        throw error;
    }
}

async function getAllProducts() {

    try {
        const {rows} = await client.query(`
            SELECT * FROM products
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getProductsByCategory( {category} ) {
    try {
        const {rows} = await client.query(`
            SELECT * FROM products
            WHERE category_name = $1
        `, [category]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getAllProductsByFeatured() {
    try {
      const { rows } = await client.query(`
      SELECT *
      FROM products
      WHERE featured = TRUE;
      `);
        return rows
    } catch (error) {
      throw error
    }
  }

// Update a product
// PATCH /db/products/:productId
async function updateProduct(id, fields = {}) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');   
    if (setString.length === 0) {
        return;
    }
    try {
        const {rows: [product]} = await client.query(`
            UPDATE products
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields));
        return product;
    } catch (error) {
        throw error;
    }
}

// DELETE /db/products/:productId
async function deleteProduct(productId) {
    try {
        await client.query(`
        DELETE FROM cart
        WHERE id = $1;
    `, [productId]);
    const {rows: [product]} = await client.query(`
        DELETE FROM products
        WHERE id = $1
        RETURNING *;    
    `, [productId]);
    return product;
    }catch (error) {
        throw error;
    }
}

    // Deactivate a product
    // PATCH /db/products/:productId

    async function deactivateProduct(id) {
        try { 
            const {rows} = await client.query(`
                UPDATE products
                SET active = false
                WHERE id = $1;
            `,[id]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

module.exports = {
    getAllProducts,
    getAllActiveProducts,
    createProduct,
    getProductsByCategory,
    getAllProductsByFeatured,
    deleteProduct,
    updateProduct,
    getProductById,
    deactivateProduct
};