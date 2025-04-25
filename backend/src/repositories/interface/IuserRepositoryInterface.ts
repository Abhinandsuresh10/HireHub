import { Iuser } from "../../models/UserSchema";


export interface IuserRepositoryInterface {
    createUser(userData: Iuser): Promise<Iuser>;
    findByEmail(email: string): Promise<Iuser | null>;
    updateUser(id: string, userData: Iuser): Promise<Iuser | null>;
    findUserById(userId: string): Promise<Iuser | null>;
}