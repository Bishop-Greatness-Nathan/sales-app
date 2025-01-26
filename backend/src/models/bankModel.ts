import mongoose from "mongoose"

const BankSchema = new mongoose.Schema(
  {
    amount: Number,
    remark: {
      type: String,
      default: "Money received from sales order",
    },
    action: {
      type: String,
      default: "add",
    },
    enteredBy: String,
    enteredAt: String,
  },
  { timestamps: true }
)

export default mongoose.model("Bank", BankSchema)
