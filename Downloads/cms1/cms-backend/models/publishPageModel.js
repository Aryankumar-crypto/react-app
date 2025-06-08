import mongoose, { Schema, model, models } from "mongoose";

const publishPageSchema = new Schema({
  page: {
    type: Schema.Types.ObjectId,
    ref: "preview_page",
  },
  meta_ref: {
    type: String,
    required: true,
  },
});

publishPageSchema.virtual("meta_details", {
  ref: "seo_detail",
  localField: "meta_ref",
  foreignField: "key",
  justOne: true,
});

publishPageSchema.set("toObject", { virtuals: true });
publishPageSchema.set("toJSON", { virtuals: true });

export const publishPageModel = models.publish_page || model("publish_page", publishPageSchema);
