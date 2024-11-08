import { db } from "../configs";
import { Message } from "../models/Message";

const collection = db.collection<Message>("messages");

async function findById(id: Date) {
  return collection.findOne({ timestamp: id });
}

async function findAll() {
  return collection.find({}).toArray();
}

async function create(item: Message) {
  return collection.insertOne(item);
}

async function update(id: Date, item: Message) {
  return collection.replaceOne({ timestamp: id }, item);
}

async function remove(id: Date) {
  return collection.deleteOne({ timestamp: id });
}

const MessageRepository = {
  findById,
  findAll,
  create,
  update,
  remove,
};

export default MessageRepository;
