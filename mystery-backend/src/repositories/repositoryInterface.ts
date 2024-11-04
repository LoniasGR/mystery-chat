import { InsertOneResult, DeleteResult, Document, UpdateResult } from "mongodb";

export interface RepositoryInterface<T extends Document, K> {
  findById(id: K): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(item: T): Promise<InsertOneResult<T>>;
  update(id: K, item: T): Promise<UpdateResult<T> | Document>;
  delete(id: K): Promise<DeleteResult>;
}
