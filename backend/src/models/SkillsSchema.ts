import mongoose , { Schema, Document } from 'mongoose'


export interface ISkills extends Document {
    category: string;
    skills?: [string];
    createdAt: Date;
    updatedAt: Date;
}

const SkillCategorySchema = new Schema<ISkills>({
     category: {
        type: String,
        required: true
     },
     skills: {
        type: [String],
     }
},{ timestamps: true }); 

export default mongoose.model<ISkills>('Skills', SkillCategorySchema);