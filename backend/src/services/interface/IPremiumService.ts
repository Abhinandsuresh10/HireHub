import { PreimumFormData } from "../../types/premium.type";



export interface IPremiumService {
   addPremium(data: PreimumFormData): Promise<void>;
   getPremiums(page: number, limit: number): Promise<{premiums: PreimumFormData[] | null; total: number}>;
   patchPremium(id: string): Promise<void>;
   deletePremium(id: string): Promise<void>;
   getApremium(id: string): Promise<PreimumFormData | null>;
   updatePremium(id: string, data: PreimumFormData): Promise<void>;
   getAllPremiums(role: string): Promise<PreimumFormData[] | null>; 
}