import mongoose from "mongoose"

const ExpenseSchema = new mongoose.Schema(
  {
    description: String,
    amount: Number,
    enteredAt: String,
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    enteredBy: String,
  },
  { timestamps: true }
)

export default mongoose.model("Expense", ExpenseSchema)
