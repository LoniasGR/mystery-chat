import { User } from "../models/User";
import { db } from "../configs";

const collection = db.collection<User>("users");

function create(user: User) {
  return collection.insertOne(user);
}

function createMany(users: Array<User>) {
  return collection.insertMany(users);
}

function findById(id: string) {
  return collection.findOne({ _id: id });
}

function findAll(): Promise<User[]> {
  return collection.find({}).toArray();
}

function remove(id: string) {
  return collection.deleteOne({ _id: id });
}

function update(id: string, item: User) {
  return collection.replaceOne({ _id: id }, item);
}

const UserRepository = {
  create,
  createMany,
  findById,
  findAll,
  remove,
  update,
};

export default UserRepository;
