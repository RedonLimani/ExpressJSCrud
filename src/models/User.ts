import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';
import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'guide';
  passwordChangedAt:Date

  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changePasswordAfter(
    JWTTimestamp:Date
  ):Promise<boolean>;
}


const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true ,minlength: 8,select:false},
  role: { type: String, enum: ["user", "admin", "guide"], default: "user" },
  passwordChangedAt:Date
});



userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) 

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.correctPassword=async function(candidatePassword:string,userPassword:string){
    return await bcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.changePasswordAfter=function(JWTTimestamp:Date){
  if(this.passwordChangetAt){
    const changedTimestamp=parseInt((this.passwordChangetAt.getTime() /1000).toString(),10)
    const JWTTimestamp=parseInt((this.JWTTimestamp.getTime() /1000).toString(),10)
    console.log(changedTimestamp,JWTTimestamp)
    return JWTTimestamp <changedTimestamp
  }
  
  return false;
}

export default model("User", userSchema);

