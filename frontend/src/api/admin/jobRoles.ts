import { handleAxiosError } from "../../utils/HandleError";
import JobRolesAPI from "../../config/jobRolesApi";



export const addCategorys = async(category: string) => {
   try {
    const response = await JobRolesAPI.post('/addCategory', { category });
    return response;
   } catch (error) {
    handleAxiosError(error)
   }
}


export const getJobRoles = async() => {
   try {
      const response = await JobRolesAPI.get('/getCategory');
      return response;
   } catch (error) {
      handleAxiosError(error);
   }
}


export const addJobRoles = async(role: string, id: string) => {
   try {
     const response = await JobRolesAPI.put('/addJobRoles', { role, id } );
     return response;
   } catch (error) {
     handleAxiosError(error); 
   }
}

export const deleteCategoryFunc = async(id: string) => {
   try {
     const response = await JobRolesAPI.delete(`/deleteCategory/${id}`);
     return response;
   } catch (error) {
     handleAxiosError(error);
   }
}

export const deleteRoleFunc = async(id: string, role: string) => {
   try {
      const response = await JobRolesAPI.patch('/deleteJobRoles', { id, role });
      return response;
   } catch (error) {
      handleAxiosError(error)
   }
}