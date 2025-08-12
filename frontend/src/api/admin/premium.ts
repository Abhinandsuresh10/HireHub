import { handleAxiosError } from "../../utils/HandleError";
import PremiumAPI from "../../config/premiumApi";

export interface Premium {
  price: number;
  role: string;
  status: boolean;
}


export const addPremiumPlan = async ({ formData }: { formData: Premium }) => {
  try {
    const response = await PremiumAPI.post('/premium', { formData });
    return response;
  } catch (error) {
    console.log(error);
    throw handleAxiosError(error);
  }
}

export const getPremiums = async (page: number, limit: number) => {
  try {
    const response = await PremiumAPI.get(`/premium?page=${page}&limit=${limit}`);
    return response;
  } catch (error) {
    console.log(error);
    throw handleAxiosError(error);
  }
}

export const patchPremium = async (id: string) => {
  try {
    const response = await PremiumAPI.patch('/premium', { id });
    return response;
  } catch (error) {
    console.log(error);
    throw handleAxiosError(error);
  }
}

export const deletePremium = async (id: string) => {
  try {
    const response = await PremiumAPI.delete(`/premiumDelete/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    throw handleAxiosError(error);
  }
}

export const getPremium = async (id: string) => {
  try {
    const response = await PremiumAPI.get(`/premiumGet/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    throw handleAxiosError(error);
  }
}

export const updatePremium = async (id: string, { formData }: { formData: Premium }) => {
  try {
    const response = await PremiumAPI.put('/premium', { id , formData});
    return response;
  } catch (error) {
    console.log(error);
    throw handleAxiosError(error);
  }
}

export const getPremiumsForCards = async (role: string) => {
  try {
    const response = await PremiumAPI.get(`/premiums?role=${role}`);
    return response;
  } catch (error) {
    console.log(error);
    throw handleAxiosError(error);
  }
}