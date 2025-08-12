import { HttpResponse } from "../../constants/response.message";
import { IJobRoles } from "../../models/JobRolesSchema";
import { IJobRolesRepository } from "../../repositories/interface/IJobRolesRepository";
import { IJobRolesService } from "../interface/IJobRolesService";



export class jobRolesService implements IJobRolesService {
  private repository: IJobRolesRepository;

  constructor(repository: IJobRolesRepository) {
    this.repository = repository;
  }

  async addCategory(category: string): Promise<void> {
    try {
      const exists = await this.repository.findJobRole(category);

      if (exists) {
        throw new Error(HttpResponse.CATEGORY_ALREADY_EXIST)
      }
      await this.repository.addCategory(category);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(HttpResponse.UNKNOWN_ERROR)
      }
    }
  }


  async getCategory(): Promise<IJobRoles[] | null> {
    try {
      return await this.repository.getCategories();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(HttpResponse.UNKNOWN_ERROR)
      }
    }
  }

  async addJobRole(role: string, id: string): Promise<void> {
    try {
      const category = await this.repository.findJobRoleById(id);
      if (!category) throw new Error(HttpResponse.CATEGORY_GET_FAIL);
      await this.repository.addJobRole(role, id);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(HttpResponse.UNKNOWN_ERROR)
      }
    }
  }
  async deleteCategory(id: string): Promise<void> {
    try {
      const category = await this.repository.findJobRoleById(id);
      if (!category) throw new Error(HttpResponse.CATEGORY_GET_FAIL);
      await this.repository.deleteCategory(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(HttpResponse.UNKNOWN_ERROR)
      }
    }
  }

  async deleteJobRoles(id: string, role: string): Promise<void> {
    try {
      const category = await this.repository.findJobRoleById(id);
      if (!category) throw new Error(HttpResponse.CATEGORY_GET_FAIL);
      await this.repository.deleteJobRoles(id, role);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(HttpResponse.UNKNOWN_ERROR)
      }
    }
  }

}