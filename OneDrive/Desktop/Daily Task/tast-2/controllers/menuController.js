import mongoose from "mongoose";
import { menuItemModel } from "../models/MenuItem.js";

const buildHierarchy = async () => {
    const items = await menuItemModel.find().lean();
    const map = {};
    const roots = [];

    items.forEach((item) => (map[item._id] = { ...item, children: [] }));

    items.forEach((item) => {
        if (item.parentId) {
            map[item.parentId]?.children.push(map[item._id]);
        } else {
            roots.push(map[item._id]);
        }
    });

    return roots;
};

const calculateDepth = async (id) => {
    let depth = 1;
    let current = await menuItemModel.findById(id);
    while (current?.parentId) {
        current = await menuItemModel.findById(current.parentId);
        depth++;
    }
    return depth;
};

export const createMenuItem = async (req, res) => {
    try {
        const { title, url, parentId } = req.body;

        console.log("hit");

        if (parentId && !(await menuItemModel.findById(parentId)))
            return res.status(400).json({ error: "Invalid parentId" });

        const depth = parentId ? await calculateDepth(parentId) : 0;
        if (depth >= 3)
            return res.status(400).json({ error: "Max depth 3 exceeded" });

        const item = await menuItemModel.create({
            title,
            url,
            parentId: parentId || null,
        });
        res.json({ message: "Created", item });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const editMenuItem = async (req, res) => {
    try {
        const { id } = req.query;
        const { title, url, parentId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid ID" });

        if (parentId === id)
            return res.status(400).json({ error: "Cannot be own parent" });

        let current = await menuItemModel.findById(parentId);
        while (current) {
            if (current._id.toString() === id)
                return res.status(400).json({ error: "Circular nesting" });
            current = await menuItemModel.findById(current.parentId);
        }

        const depth = parentId ? await calculateDepth(parentId) : 0;
        if (depth >= 3)
            return res.status(400).json({ error: "Max depth 3 exceeded" });

        const item = await menuItemModel.findByIdAndUpdate(
            id,
            { title, url, parentId: parentId || null },
            { new: true }
        );
        res.json({ message: "Updated", item });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const collectDescendants = async (id) => {
    const children = await menuItemModel.find({ parentId: id });
    let all = [...children];
    for (const child of children) {
        const sub = await collectDescendants(child._id);
        all = all.concat(sub);
    }
    return all;
};

export const removeMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const descendants = await collectDescendants(id);
        const idsToDelete = [id, ...descendants.map((i) => i._id)];
        await menuItemModel.deleteMany({ _id: { $in: idsToDelete } });
        res.json({ message: "Removed", removed: idsToDelete });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const swapMenuItems = async (req, res) => {
    try {
        const { id1, id2 } = req.body;
        const item1 = await menuItemModel.findById(id1);
        const item2 = await menuItemModel.findById(id2);

        if (!item1 || !item2)
            return res.status(404).json({ error: "Items not found" });

        const temp = {
            title: item1.title,
            url: item1.url,
            parentId: item1.parentId,
        };

        item1.title = item2.title;
        item1.url = item2.url;
        item1.parentId = item2.parentId;

        item2.title = temp.title;
        item2.url = temp.url;
        item2.parentId = temp.parentId;

        await item1.save();
        await item2.save();

        res.json({ message: "Swapped", items: [item1, item2] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMenu = async (req, res) => {
    try {
        const tree = await buildHierarchy();
        res.json(tree);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
console.log("hitcontoller");
