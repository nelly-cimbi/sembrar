const express = require('express');
const productsRouter = express.Router();
const { requireUser } = require('./utils');

const {
    getAllProducts,
    getAllActiveProducts,
    getProductsByCategory,
    updateProduct,
    deleteProduct,
    getReviewsByProductId,
    postReview,
    getAllProductsByFeatured,
    getProductById,
    createProduct,
    deactivateProduct
    } = require('../db');

// GET /api/products/
productsRouter.get('/', async (req, res, next) => {
    try {
        const products = await getAllProducts();
        res.send(products);
    } catch (error) {
        next(error)
    }
})

productsRouter.get('/active', async (req, res, next) => {
    try {
        const products = await getAllActiveProducts();
        res.send(products);
    } catch (error) {
        next(error)
    }
})

productsRouter.get('/featured', async (req, res, next) => {
    try {
        const products = await getAllProductsByFeatured();
        if(products) {
            res.send(products);
        } else {
            res.send({
                name: 'NotFound',
                message: `No featured products`
            })
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.get('/:id', async (req, res, next) => {
    try {
        // const {id} =req.params
        const product = await getProductById(req.params.id);

        if(product) {
            res.send(product);
        } else {
            res.send({
                name: 'NotFound',
                message: `Could not find this product`
            })
        }   
    } catch (error) {
        next(error)
    }
})
//Reviews by product ID
productsRouter.get('/:productId/reviews', async (req, res, next) => {
    try {
        const {id} =req.params
        const reviews = await getReviewsByProductId(id);

        if(reviews.length>0) {
            res.send(reviews);
        } else {
            res.send({
                name: 'NotFound',
                message: `No reviews for this product`
            })
        }   
    } catch (error) {
        next(error)
    }
})


// create a new product
productsRouter.post("/addProduct",requireUser, async (req, res,next) =>{
    try{   
        const {name,price,short_desc,long_desc,category_name,qty,featured,active,inventory,product_tag,photo_id} = req.body;
        console.log("Active from products.Router",active)
    const createdProduct = await createProduct({name,price,short_desc,long_desc,category_name,qty,featured,active,inventory,product_tag,photo_id});
    console.log("CreatedProduct",createdProduct)
    if(createdProduct) {
      res.send(createdProduct);
    } else {
      next({
        name: 'FailedToCreate',
        message: 'There was an error creating your product'
      })
    } 

    }catch (error){
        console.log("error at router.post/products.js:api")
        next(error)
    }
})

productsRouter.get('/category/:category', async (req, res, next) => {
    try {
        console.log ("API: ", req.params.category);
        const products = await getProductsByCategory({category: req.params.category});
        
        if(products.length>0) {
            res.send(products);
        } else {
            res.send({
                name: 'NotFound',
                message: `No products have a category of ${req.params.category}`
            })
        }
        
    } catch (error) {
        next(error)
    }
})

// Update a product
// PATCH /api/products/:productId
productsRouter.patch('/patch/:id', requireUser, async (req, res, next) => {
    try {
        const {id} = req.params;
        const {name, short_desc, long_desc, category_name, price, qty, featured, inventory, photo_id} = req.body;
        console.log("short desc back end",short_desc)
        const updatedProduct = await updateProduct(id, {
            name: name,   
            short_desc: short_desc,
            long_desc: long_desc,
            category_name:category_name,
            price: price,
            qty: qty,
            featured: featured,
            inventory: inventory,
            photo_id: photo_id
        });
        res.send(updatedProduct);
    } catch (error) {
        next(error);
    }
});

// Delete a product

// DELETE /api/products/delete/:productId
productsRouter.delete('/delete/:productId', requireUser, async (req, res, next) => {
    try {
        
        const deletedProduct = await deleteProduct(req.params.productId);
        console.log(req.params.productId)
        res.send(deletedProduct);
        

    } catch (error) {
        next(error);
    }
});

// Deactivate a product
//UPDATE /api/products/deactivate/:productId
productsRouter.patch('/deactivate/:id', requireUser, async (req, res, next) => {

    try {
    const updatedProduct = await deactivateProduct(req.params.id) 
    console.log("updateProduct", updatedProduct)
    res.send(updatedProduct);
} catch (error){
    next(error);
}

});
      


// GET /api/products/:productId
productsRouter.get('/item/:productId', async (req, res, next) => {
    try {
        const product = await getProductById(req.params.productId);
        res.send(product);
    } catch (error) {
        next(error);
    }
});

// productsRouter.post('/:productId', async (req, res, next) => {
//     try {
//         const {product_id} =req.params
//         const{user_id, review, rating}= req.body
//         const result = await postReview(product_id, user_id, review, rating);

//         if(result.length>0) {
//             res.send(result);
//         } else {
//             res.send({
//                 name: 'NotFound',
//                 message: `Your review was not posted`
//             })
//         }   
//     } catch (error) {
//         next(error)
//     }
// })

// //Reviews by product ID
// productsRouter.get('/:productId', async (req, res, next) => {
//     try {
//         const {id} =req.params
//         const reviews = await getReviewsByProductId(id);

//         if(reviews.length>0) {
//             res.send(reviews);
//         } else {
//             res.send({
//                 name: 'NotFound',
//                 message: `No reviews for this product`
//             })
//         }   
//     } catch (error) {
//         next(error)
//     }
// })

module.exports = productsRouter;
