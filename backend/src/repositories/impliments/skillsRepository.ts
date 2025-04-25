import Skills, { ISkills } from "../../models/SkillsSchema";
import { ISkillsRepository } from "../interface/ISkillsRepository";
import { BaseRepository } from "./baseRepository";



export class skillsRepository extends BaseRepository<ISkills> implements ISkillsRepository {
    constructor() {
        super(Skills)
    }

    async createCategory(category: string): Promise<ISkills | null> {
        try {
          return await this.create({category}); 
        } catch (error) {
          console.log(error);
          throw new Error('Error on adding category')
        }
    }

    async findSkill(category: string): Promise<ISkills | null> {
        try {
          return await this.findOne({category: category});
        } catch (error) {
          console.log(error);
          throw new Error('Error on finding category')  
        }
    }

    async getAllSkills(): Promise<ISkills[] | null> {
        try {
          return await this.find();  
        } catch (error) {
          console.log(error);
          throw new Error('Error on getting skills')
        }
    }

    async findSkillById(id: string): Promise<ISkills | null> {
        try {
          return await this.findByIds(id)
        } catch (error) {
          console.log(error);
          throw new Error('Error on getting skills')
        }
    }


    async deleteSkills(id: string, skill: string): Promise<void> {
        try {
          await Skills.findByIdAndUpdate(id, {$pull: {skills: skill}},{new: true});
        } catch (error) {
          console.log(error);
          throw new Error('Error on deleting skill')
        }
    }

    async deleteCategories(id: string): Promise<void> {
        try {
          return await this.findByIdAndDelete(id);
        } catch (error) {
          console.log(error);
          throw new Error('Error on deleting category')
        }
    }

    async addUniqueSkills(id: string, skill: string): Promise<ISkills | null> {
        try {
          return await Skills.findByIdAndUpdate(
            id,
            { $addToSet: { skills: skill } }, 
            { new: true }
          );
        } catch (error) {
          console.log(error);
          throw new Error('Error on adding skill') 
        }
    }
}