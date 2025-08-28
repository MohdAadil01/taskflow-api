import mongoose, { Schema, Document } from "mongoose";
import { comparePassword } from "../utils/brcypt";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isPasswordCorrect(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return comparePassword(password, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
