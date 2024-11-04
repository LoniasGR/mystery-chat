import {
  InsertOneResult,
  Document,
  UpdateResult,
  DeleteResult,
  Collection,
  Db,
} from "mongodb";
import { Message } from "../models/Message";
import { RepositoryInterface } from "./repositoryInterface";

class MessageRepository implements RepositoryInterface<Message, Date> {
  collectionName = "messages";
  db: Db;
  collection: Collection<Message>;

  constructor(db: Db) {
    this.db = db;
    this.collection = db.collection<Message>(this.collectionName);
  }
  findById(id: Date): Promise<Message | null> {
    return this.collection.findOne({ timestamp: id });
  }

  findAll(): Promise<Message[]> {
    return this.collection.find({}).toArray();
  }

  create(item: Message): Promise<InsertOneResult<Message>> {
    return this.collection.insertOne(item);
  }

  update(id: Date, item: Message): Promise<Document | UpdateResult<Message>> {
    return this.collection.replaceOne({ timestamp: id }, item);
  }

  delete(id: Date): Promise<DeleteResult> {
    return this.collection.deleteOne({ timestamp: id });
  }
}

export default MessageRepository;
