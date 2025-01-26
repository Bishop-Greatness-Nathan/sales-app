import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  store: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  CP: {
    type: Number,
    required: true,
  },
  SP: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  maximumQty: Number,
  minimumQty: Number,
  category: String,
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
})

export default mongoose.model("Product", ProductSchema)
