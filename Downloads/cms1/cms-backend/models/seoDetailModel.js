import mongoose, { Schema, model, models } from "mongoose";

const seoDetailSchema = new Schema({
  key: { type: String, required: true, unique: true },
  meta: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: String, default: "" },
  },
});

export const seoDetailModel = models.seo_detail || model("seo_detail", seoDetailSchema);
