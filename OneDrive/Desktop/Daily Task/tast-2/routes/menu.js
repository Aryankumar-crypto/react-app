import express from "express";
import {
    createMenuItem,
    editMenuItem,
    removeMenuItem,
    swapMenuItems,
    getMenu,
} from "../controllers/menuController.js";

const router = express.Router();

router.post("/create", createMenuItem);
router.put("/edit", editMenuItem);
router.delete("/remove/:id", removeMenuItem);
router.post("/swap", swapMenuItems);
router.get("/", getMenu);
console.log("hitroutes");

export default router;
