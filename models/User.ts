import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;  
  email: string;
  password: string;
  age: number;
}

// Schema
const UserSchema = new Schema<IUser>({
  username:{type: String, required: true},  
  email: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number, required: false }

});

// model using the interface
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
