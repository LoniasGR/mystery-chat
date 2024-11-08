import { db } from "../configs";
import { RefreshToken } from "../models/RefreshTokens";

const collection = db.collection<RefreshToken>("refresh-tokens");

async function create(token: RefreshToken) {
  return collection.insertOne(token);
}

async function findByTokenName(token: string) {
  return collection.findOne({ token: token });
}

async function findByUser(username: string) {
  return collection.find({ username: username }).toArray();
}

async function findAll(): Promise<RefreshToken[]> {
  return collection.find({}).toArray();
}

async function remove(id: string) {
  return collection.deleteOne({ token: id });
}

const RefreshTokenRepository = {
  create,
  findAll,
  findByTokenName,
  findByUser,
  remove,
};

export default RefreshTokenRepository;
