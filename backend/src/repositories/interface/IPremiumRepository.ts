import { PreimumFormData } from "../../types/premium.type";


export interface IPremiumRepository {
    addPremium(data: PreimumFormData): Promise<void>;
    getPremiums(page: number, limit: number): Promise<{premiums: PreimumFormData[] | null; total: number}>;
    findPremiumById(id: string): Promise<PreimumFormData | null>;
    patchPremium(id: string, status: boolean): Promise<void>;
    deletePremium(id: string): Promise<void>;
    updatePremium(id: string, data: PreimumFormData): Promise<void>;
    getAllPremiums(role: string): Promise<PreimumFormData[] | null>;
}