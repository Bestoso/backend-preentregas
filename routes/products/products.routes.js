const { Router } = require('express');
const ProductManager = require('../../helpers/productManager');
const manager = new ProductManager('./data/products.json');

const router = Router();

router.get('/', async (req, res) => {
    const { limit } = req.query;
    const products = await manager.getItems();
    if (!limit) {
        res.json({
            msg: "success",
            data: products
        });
    } else {
        const slicedProducts = products.slice(0, +limit);
        res.json({
            msg: "success",
            data: slicedProducts
        });
    }
})

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const itemFound = await manager.getItemById(+pid);
    if (!itemFound) {
        res.status(404).json({
            msg: "error",
            error: "item not found"
        });
    } else {
        res.json({
            msg: "success",
            data: itemFound
        });
    }
})

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updatedProduct = req.body;
    const foundId = updatedProduct.hasOwnProperty("id"); // el metodo hasOwnProperty devuelve un booleano dependiendo si tiene o no la propiedad especeificada
    const data = await manager.updateProduct(+pid, updatedProduct);

    if (foundId) {
        res.status(400).send("no se puede modificar la propiedad id");
    } else {
        if(data){
            res.json({
                status: "succes",
                data: data
            });
        } else {
        res.status(400).send("no se encontro el producto")
        }
    }
})

router.post('/create', async (req, res) => {
    const product = req.body;
    if (!product.title ||!product.description ||!product.price ||!product.code ||!product.status ||!product.category ||!product.thumbnails) {
        res.json({
            msg: "error",
            error: "Must specify all fields"
        })
    } else {
        const data = await manager.addProduct(product);
        res.json({
            msg: "success",
            data: data
        })
    }
})

router.delete('/delete/:pid', async (req, res) => {
    const { pid } = req.params;
    if (isNaN(pid)) {
        res.status(400).send("Typeof parameter 'pid' must be number");
    } else {
            res.json({
            status: "succes",
            data: await manager.deleteProduct(+pid),
        });
    }
});

module.exports = router;