const { Router } = require("express");

const router = Router();

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;

    if (isNaN(cid)) {
        res.status(400).send("typeof parameter must be number");
    } else {
        res.json({
            status: "success",
            data: await manager.getItemById(+cid),
        });
    }
});

router.post("/", async (req, res) => {
    res.json({
        status: "success",
        data: await manager.createCart(),
    });
});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid } = req.params;
    const { pid } = req.params;
    const data = await manager.addToCart(+cid, +pid);

    if (isNaN(cid) || isNaN(pid)) {
        res.status(400).json({
            error: "paramaters must be numbers"
        })
    } else {
        res.json({
            status: "success",
            data: data,
    });
}
});

module.exports = router;
