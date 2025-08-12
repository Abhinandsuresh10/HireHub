import JobRoles, { IJobRoles } from "../../models/JobRolesSchema";
import { IJobRolesRepository } from "../interface/IJobRolesRepository";
import { BaseRepository } from "./baseRepository";



export class jobRolesRepository extends BaseRepository<IJobRoles> implements IJobRolesRepository {
    constructor() {
        super(JobRoles)
    }

    async addCategory(category: string): Promise<void> {
        try {
            await this.create({ category });
        } catch (error) {
            console.log(error);
            throw new Error('Error on creating jobRoles category');
        }
    }

    async findJobRole(category: string): Promise<IJobRoles | null> {
        try {
            return await this.findOne({ category: category });
        } catch (error) {
            console.log(error);
            throw new Error('Error on finding already exist jobRoles')
        }
    }

    async findJobRoleById(id: string): Promise<IJobRoles | null> {
        try {
            return await JobRoles.findById(id);
        } catch (error) {
            console.log(error);
            throw new Error('Error on finding already exist jobRoles')
        }
    }

    async getCategories(): Promise<IJobRoles[] | null> {
        try {
            return await JobRoles.find();
        } catch (error) {
            console.log(error);
            throw new Error('Error on finding already exist jobRoles')
        }
    }

    async addJobRole(role: string, id: string): Promise<void> {
        try {
            await JobRoles.findByIdAndUpdate(id, { $push: { jobRole: role } })
        } catch (error) {
            console.log(error);
            throw new Error('Error on adding jobRoles')
        }
    }

    async deleteCategory(id: string): Promise<void> {
        try {
            await JobRoles.findByIdAndDelete(id);
        } catch (error) {
            console.log(error);
            throw new Error('Error on deleting ( jobRoles ) category')
        }
    }

    async deleteJobRoles(id: string, role: string): Promise<void> {
        try {
           await JobRoles.findByIdAndUpdate(id, { $pull: { jobRole: role } })
        } catch (error) {
            console.log(error);
            throw new Error('Error on deleting ( jobRoles )')
        }
    }

}