import { ISkills } from "../../models/SkillsSchema";


export interface ISkillsService {
    addCategory(category: string): Promise<ISkills | null>;
    getSkills(): Promise<ISkills[] | null>
    addSkills(id: string, skill: string): Promise<ISkills | null>;
    deleteSkill(id: string, skill: string): Promise<void>;
    deleteCategory(id: string): Promise<void>;
}