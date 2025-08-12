import { IJobRoles } from "../../models/JobRolesSchema";


export interface IJobRolesService {
    addCategory(category: string): Promise<void>;
    getCategory(): Promise<IJobRoles[] | null>
    addJobRole(role: string, id: string): Promise<void>;
    deleteCategory(id: string): Promise<void>;
    deleteJobRoles(id: string, role: string): Promise<void>
}