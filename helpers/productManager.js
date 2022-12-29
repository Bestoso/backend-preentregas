const fs = require("fs/promises");

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }
    // METODOS DE OBTENCION DE DATOS
    async getItems() {
        const data = await fs.readFile(this.path, "utf-8");
        const items = await JSON.parse(data);
        return items;
    }

    async writeFile(data) {
        const stringData = JSON.stringify(data, null, 4);
        return await fs.writeFile(this.path, stringData, "utf-8");
    }

    async getItemById(id) {
        const items = await this.getItems(); // devuelve todos los items que se encuentren en el archivo
        const itemFound = items.find((item) => item.id === id); // buscamos el item por id
        if (itemFound) {
            return itemFound; // si existe devolvemos el item
        } else {
            console.log("Product not found"); // si no existe devolvemos un error
        }
    }

    // METODOS DE PRODUCTOS
    async addProduct(product) {
        let products = await this.getItems(); // leemos la data y la parseamos
        const newProduct = {
            id: products.length + 1,
            ...product
        }; // creamos un nuevo producto con el id y los datos que nos llegan
        products.push(newProduct); // agregamos el nuevo producto al array de productos
        await this.writeFile(products); // escribimos el nuevo array de productos en el archivo
        return products; // devolvemos el array de productos (para mostrarlo luego en la respuesta)
    }

    async updateProduct(pid, properties) {
        const products = await this.getItems(); // leemos la data y la parseamos
        const productFound = await this.getItemById(pid); // buscamos el producto por id
        const updatedProduct = { ...productFound, ...properties }; // creamos un nuevo producto con los datos que nos llegan

        if (productFound) {
            const updatedList = products.map(prod => { 
                if (prod.id === updatedProduct.id) {
                    return updatedProduct; // si existe devolvemos el item actualizado
                } else {
                    return prod; // si no existe devolvemos el item sin modificar
                }
            });
            this.writeFile(updatedList); // escribimos el nuevo array de productos en el archivo
            return updatedList; // devolvemos el array de productos
        } else {
            console.log("no se encontro el producto"); // si no existe devolvemos un error
        }
    }

    async deleteProduct(pid) {
        // validacion de que si no existe el prod con ese id devuelva error
        const products = await this.getItems(); // leemos la data y la parseamos
        const filteredProducts = products.filter((product) => product.id !== pid); // filtramos el array de productos para que no incluya el producto con el id que nos llega
        await this.writeFile(filteredProducts); // escribimos el nuevo array de productos en el archivo
        return filteredProducts;
    }

    // METODOS PARA EL CARRITO
    async createCart() {
        // POST: crea un cart nuevo con un id y un array de productos
        let cart = await this.getItems(); // leemos la data y la parseamos
        const newCart = { id: cart.length + 1, products: [] }; // creamos un nuevo carrito con el id y un array vacio de productos
        cart.push(newCart); // agregamos el nuevo carrito al array de carritos
        await this.writeFile(cart); // escribimos el nuevo array de carritos en el archivo
        return cart; // devolvemos el array de carritos
    }

    async addToCart(cid, pid) {
        let cart = await this.getItems();
        const order = cart.find((o) => o.orderId === cid);

        if (order) {
            const productExist = order.products.find((prod) => prod.prodId === pid);

            if (productExist) {
                const orderPosition = cart.findIndex((order) => order.orderId === cid);
                const updateProduct = cart[orderPosition].products.find(
                    (prod) => prod.prodId === pid
                );
                const productPosition = cart[orderPosition].products.findIndex(
                    (prod) => prod.prodId === pid
                );

                cart[orderPosition].products[productPosition].quantity =
                updateProduct.quantity + 1;
                await this.writeFile(cart);
                return cart;

            } else {
                const newProduct = { prodId: pid, quantity: 1 };
                const orderPosition = cart.findIndex((order) => order.orderId === cid);
                if (orderPosition <= 0) {
                    cart[orderPosition].products.push(newProduct);
                    await this.writeFile(cart);
                    return cart;
                }
            }
        } else {
            const newOrder = {
                orderId: cart.length + 1,
                products: [{ prodId: pid, quantity: 1 }],
            };
            cart.push(newOrder);
            await this.writeFile(cart);
            return cart;
        }
    }
}

module.exports = ProductManager;
