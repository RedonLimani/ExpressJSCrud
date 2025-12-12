import { Schema, model } from "mongoose";

const itemSchema = new Schema({
  name: { type: String, required: true }, 
  quantity: { type: Number, default: 1 } 
});

export default model("Item", itemSchema);
