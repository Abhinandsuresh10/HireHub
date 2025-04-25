import mongoose, { Schema, Document } from "mongoose";

export interface Iadmin extends Document {
    name:string;
    mobile:string;
    email:string;
    password:string;
    createdAt?:Date;
    updatedAt?:Date;
}

const AdminSchema = new Schema<Iadmin>(
    {
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        email: { type: String, required: true},
        password: { type: String, required: true },
    },
    { timestamps: true}
);

export default mongoose.model<Iadmin>("Admin", AdminSchema);