import mongoose from "mongoose"

const SingleOrderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  pcs: {
    type: Number,
    required: true,
  },
  subTotal: {
    type: Number,
    required: true,
  },
  returned: {
    type: Number,
    default: 0,
  },
  diff: {
    type: Number,
    required: true,
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
})

const OrderSchema = new mongoose.Schema(
  {
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleOrderItemSchema],
    balance: Number,
    cash: Number,
    bank: Number,
    customer: {
      firstName: String,
      lastName: String,
      phoneNumber: String,
      role: String,
      _id: String,
    },
    points: Number,
    usedPoints: Number,
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    enteredAt: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model("Order", OrderSchema)
