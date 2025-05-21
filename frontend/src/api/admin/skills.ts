import { handleAxiosError } from "../../utils/HandleError";
import SkillsAPI from "../../config/skillsApi";

export const addCategorys = async(category: string) => {
   try {
    const response = await SkillsAPI.post('/addCategory', { category });
    return response;
   } catch (error) {
    handleAxiosError(error)
   }
}

export const getSkills = async() => {
   try {
      const response = await SkillsAPI.get('/getSkills');
      return response;
   } catch (error) {
      handleAxiosError(error);
   }
}

export const addSkills = async(categoryId: string, skill: string) => {
   try {
      const response = await SkillsAPI.post(`/addSkill?categoryId=${categoryId}`, { skill });
      return response;
   } catch (error) {
      handleAxiosError(error);
   }
}

export const deleteSkills = async(categoryId: string, skill: string) => {
   try {
     return await SkillsAPI.post(`/deleteSkill?categoryId=${categoryId}`, { skill })
   } catch (error) {
      handleAxiosError(error);
   }
}

export const deleteCategories = async(categoryId: string) => {
   try {
     return await SkillsAPI.delete(`/deleteCategory?categoryId=${categoryId}`); 
   } catch (error) {
      handleAxiosError(error);
   }
}

