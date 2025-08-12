import { HttpResponse } from "../../constants/response.message";
import { IPremiumRepository } from "../../repositories/interface/IPremiumRepository";
import { PreimumFormData } from "../../types/premium.type";
import { IPremiumService } from "../interface/IPremiumService";



export class premiumService implements IPremiumService {
    private repository: IPremiumRepository;

    constructor(repository: IPremiumRepository) {
        this.repository = repository;
    }

    async addPremium(data: PreimumFormData): Promise<void> {
        try {
            await this.repository.addPremium(data);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async getPremiums(page: number, limit: number): Promise<{ premiums: PreimumFormData[] | null; total: number }> {
        try {
            const { premiums, total } = await this.repository.getPremiums(page, limit);
            return { premiums, total };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async patchPremium(id: string): Promise<void> {
        try {
            const premium = await this.repository.findPremiumById(id);
            if (!premium) throw new Error(HttpResponse.PREMIUM_FET_FAIL);
            const status = !premium.status;
            await this.repository.patchPremium(id, status)
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async deletePremium(id: string): Promise<void> {
        try {
            await this.repository.deletePremium(id);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async getApremium(id: string): Promise<PreimumFormData | null> {
        try {
            const premium = await this.repository.findPremiumById(id);
            if (!premium) throw new Error(HttpResponse.PREMIUM_FET_FAIL);
            return premium;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async updatePremium(id: string, data: PreimumFormData): Promise<void> {
        try {
            const premium = await this.repository.findPremiumById(id);
            if (!premium) throw new Error(HttpResponse.PREMIUM_FET_FAIL);
            await this.repository.updatePremium(id, data);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async getAllPremiums(role: string): Promise<PreimumFormData[] | null> {
        try {
          return await this.repository.getAllPremiums(role);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }
}