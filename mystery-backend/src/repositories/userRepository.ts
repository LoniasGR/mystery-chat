import { Collection, Db } from "mongodb";
import { RepositoryInterface } from "./repositoryInterface";
import { User } from "../models/User";

class UsersRepository implements RepositoryInterface<User, string> {
  collectionName = "users";
  db: Db;
  collection: Collection<User>;

  constructor(db: Db) {
    this.db = db;
    this.collection = db.collection<User>(this.collectionName);
  }

  create(user: User) {
    return this.collection.insertOne(user);
  }

  createMany(users: Array<User>) {
    return this.collection.insertMany(users);
  }

  findById(id: string) {
    return this.collection.findOne({ username: id });
  }

  findAll(): Promise<User[]> {
    return this.collection.find({}).toArray();
  }

  delete(id: string) {
    return this.collection.deleteOne({ username: id });
  }

  update(id: string, item: User) {
    return this.collection.replaceOne({ username: id }, item);
  }
}
export { UsersRepository };
