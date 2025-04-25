import { ISkills } from "../../models/SkillsSchema";



export interface ISkillsRepository {
    createCategory(category: string): Promise<ISkills | null>;
    getAllSkills(): Promise<ISkills[] | null>
    findSkill(category: string): Promise<ISkills | null>
    findSkillById(id: string): Promise<ISkills | null>;
    deleteSkills(id: string, skill: string): Promise<void>;
    deleteCategories(id: string): Promise<void>;
    addUniqueSkills(id: string, skill: string): Promise<ISkills | null>;
}