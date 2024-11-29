import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  branch: String,
  userName: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
  },
})

export default mongoose.model("User", UserSchema)
