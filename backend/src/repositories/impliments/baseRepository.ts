import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";
import { IbaseRepositoryInterface } from '../interface/IbaseRepositoryInterface'


export class BaseRepository<T extends Document> implements IbaseRepositoryInterface<T> {
      constructor(protected readonly model: Model<T>) {}

      async create (data: Partial<T>): Promise<T> {
        try {
            const entity = new this.model(data);
            return await entity.save();
          } catch (error: unknown) {
            throw new Error(`Error creating entity: ${error instanceof Error ? error.message : String(error)}`);
          }
      }

      async findOne(filter: FilterQuery<T>): Promise<T | null> {
          try {
            return await this.model.findOne(filter).exec();
          } catch (error) {
            throw new Error(`Error finding entity: ${error instanceof Error ? error.message : String(error)}`);
          }
      }

      async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
        try {
          const entity = await this.model.findByIdAndUpdate(id, data, {new : true}).exec();
          return entity;
        } catch (error) {
          throw new Error(`Error updating entity: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      async findAll(page: number, limit: number, search: string): Promise<{data:T[]; total: number}> {
        try {
          const skip = (page - 1) * limit;
          const query = search
          ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { jobRole: { $regex: search, $options: "i" } }, 
              { company: { $regex: search, $options: "i" } } ,
            ],
          }
          : {};
          const data =  await this.model.find(query).skip(skip).limit(limit).exec();
          const total = await this.model.countDocuments(query);
          return { data , total}
        } catch (error) {
          throw new Error(`Error updating entity: ${error instanceof Error ? error.message : String(error)}`)
        }
      }

      async findAllById(id: object, page: number, limit: number): Promise<{data: T[]; total:number}> {
             try {
              const skip = (page - 1) * limit;
              const data = await this.model.find(id).skip(skip).limit(limit).exec();
              const total = await this.model.countDocuments(id);
              return {data, total};
             } catch (error) {
              throw new Error(`Error getting entity: ${error instanceof Error ? error.message : String(error)}`)
             }
      }

      async findByIdAndDelete(id: string) {
        try {
          await this.model.findByIdAndDelete(id)
        } catch (error) {
          throw new Error(`Error getting entity: ${error instanceof Error ? error.message : String(error)}`)
        }
      }

      async findByIds(id: string): Promise<T | null> {
        try {
              return await this.model.findById({_id: id}).exec();
            } catch (error) {
              throw new Error(`Error getting entity: ${error instanceof Error ? error.message : String(error)}`)
            }
      }

      async findDatasById(id: object): Promise<T[]> {
        try {
          const data = await this.model.find(id);
          return  data ;
        } catch (error) {
          throw new Error(`Error adding entity: ${error instanceof Error ? error.message : String(error)}`)
        }
      }
      

      async find(): Promise<T[]> {
        try {
          const data = await this.model.find();
          return data;
        } catch (error) {
          throw new Error(`Error getting entity: ${error instanceof Error ? error.message : String(error)}`)
        }
      }
}