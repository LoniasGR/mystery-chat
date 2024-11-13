import { db } from "../configs";
import { Message } from "../models/Message";

const collection = db.collection<Message>("messages");

async function findByTimestamp(id: Date) {
  return collection.findOne({ timestamp: id.toISOString() });
}

async function findManyOlderThan(time: Date, limit?: number) {
  return collection
    .find({
      timestamp: {
        $gte: time.toISOString(),
      },
    })
    .sort({ timestamp: -1 })
    .limit(limit ?? 20)
    .toArray();
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
  findByTimestamp,
  findManyOlderThan,
  create,
  update,
  remove,
};

export default MessageRepository;
