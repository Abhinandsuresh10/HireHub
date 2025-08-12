import Premium, { IPremium } from "../../models/PremiumSchema";
import { PreimumFormData } from "../../types/premium.type";
import { IPremiumRepository } from "../interface/IPremiumRepository";
import { BaseRepository } from "./baseRepository";



export class premiumRepository extends BaseRepository<IPremium> implements IPremiumRepository {
    constructor() {
        super(Premium)
    }

    async addPremium(data: PreimumFormData): Promise<void> {
        try {
            await Premium.create(data);
        } catch (error) {
            console.log(error);
            throw new Error('Error on creating premium');
        }
    }

    async getPremiums(page: number, limit: number): Promise<{ premiums: PreimumFormData[] | null; total: number }> {
        try {
            const skip = (page - 1) * limit;
            const premiums = await Premium.find().skip(skip).limit(limit).lean<PreimumFormData[]>();
            const total = await Premium.countDocuments();
            return { premiums, total }
        } catch (error) {
            console.log(error);
            throw new Error('Error on getting premium');
        }
    }

    async findPremiumById(id: string): Promise<PreimumFormData | null> {
        try {
            return await Premium.findById(id);
        } catch (error) {
            console.log(error);
            throw new Error('Error on getting premium');
        }
    }

    async patchPremium(id: string, status: boolean): Promise<void> {
        try {
            await Premium.findByIdAndUpdate(id, { status })
        } catch (error) {
            console.log(error);
            throw new Error('Error on updating premium');
        }
    }

    async deletePremium(id: string): Promise<void> {
        try {
            await Premium.findByIdAndDelete(id);
        } catch (error) {
            console.log(error);
            throw new Error('Error on deleting premium');
        }
    }

    async updatePremium(id: string, data: PreimumFormData): Promise<void> {
        try {
            await Premium.findByIdAndUpdate(id, data);
        } catch (error) {
            console.log(error);
            throw new Error('Error on updating premium');
        }
    }

    async getAllPremiums(role: string): Promise<PreimumFormData[] | null> {
        try {
           return await Premium.find({ role: role})
        } catch (error) {
            console.log(error);
            throw new Error('Error on updating premium');
        }
    }
}