import { IJobRoles } from "../../models/JobRolesSchema";




export interface IJobRolesRepository {
   findJobRole(category: string): Promise<IJobRoles | null>;
   addCategory(category: string): Promise<void>;
   getCategories(): Promise<IJobRoles[] | null>;
   findJobRoleById(id: string): Promise<IJobRoles | null>
   addJobRole(role: string, id: string): Promise<void>;
   deleteCategory(id: string): Promise<void>;
   deleteJobRoles(id: string, role: string): Promise<void>
}