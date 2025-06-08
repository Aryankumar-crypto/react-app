import mongoose, { Schema, model, models } from "mongoose";

const previewPageSchema = new Schema({
  title: {
    id: { type: String, required: true },
  },
  meta: {
    url: { type: String, required: true },
    slug: { type: String, required: true },
    meta_title: { type: String, default: "" },
    meta_keywords: { type: String, default: "" },
    meta_description: { type: String, default: "" },
  },
  sections: [
    {
      key: { type: String, required: true },
      section_ref: { type: String, required: true },
    },
  ],
  revision: {
    type: Number,
    default: 1,
    required: true,
  },
});

export const previewPageModel = models.preview_page || model("preview_page", previewPageSchema);
