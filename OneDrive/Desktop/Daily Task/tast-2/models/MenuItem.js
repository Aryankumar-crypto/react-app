import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, default: "" },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        default: null,
    },
});
console.log("hitmenuitem");

export const menuItemModel = mongoose.model("MenuItem", menuItemSchema);
