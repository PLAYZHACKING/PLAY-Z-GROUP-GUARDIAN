import { db } from "./db";
import {
  messages,
  type InsertMessage,
  type Message
} from "@shared/schema";

export interface IStorage {
  // We can add persistence later if needed, for now just basic placeholders
  logMessage(message: InsertMessage): Promise<Message>;
}

export class DatabaseStorage implements IStorage {
  async logMessage(message: InsertMessage): Promise<Message> {
    const [logged] = await db.insert(messages).values(message).returning();
    return logged;
  }
}

export const storage = new DatabaseStorage();
