import { Document, FilterQuery, UpdateQuery } from "mongoose";

export interface IbaseRepositoryInterface<T extends Document> {
    create(data: Partial<T>):Promise<T>;
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    update(id: string, data: UpdateQuery<T>):Promise <T | null>;
    findAll(page: number, limit: number, search: string): Promise<{data:T []; total: number}>;
    findAllById(id: object, page: number, limit: number): Promise<{data: T[]; total: number}>;
    findDatasById(id: object): Promise<T[]>;
    findByIdAndDelete(id: string): Promise<void>;
    findByIds(userId: string): Promise<T | null>;
}