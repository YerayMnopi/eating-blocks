import { type Db, MongoClient } from "mongodb";

/**
 * Settings related to the database
 */
export class DbSettings {
  private readonly uri = process.env.DB_URI ?? "mongodb://localhost:27017";
  private readonly dbName = process.env.DB_NAME ?? "eating_blocks_fe";
  private readonly client: MongoClient;

  constructor() {
    this.client = new MongoClient(this.uri);
  }

  get connection(): Db {
    return this.client.db(this.dbName);
  }
}

export default new DbSettings();
