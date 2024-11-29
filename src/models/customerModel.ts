import mongoose from "mongoose"

const CustomerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    minLength: 11,
    maxLength: 11,
    trim: true,
  },
  debt: { type: Number, default: 0 },
  role: {
    type: String,
    default: "customer",
  },
  bonus: Number,
})

export default mongoose.model("Customer", CustomerSchema)
