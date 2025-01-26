import mongoose from "mongoose"

const EndOfDaySchema = new mongoose.Schema({
  date: String,
  products: [],
})

export default mongoose.model("EndOfDay", EndOfDaySchema)
