import {
    InsertOneResult,
    ObjectId,
    type BulkWriteResult,
    type Collection,
    type Db,
    type UpdateOneModel,
} from 'mongodb';
import DbSettings from '../db';

export interface CreateUser {
    email: string
    password: string
}

export interface User extends CreateUser {
    _id: ObjectId
    name?: string
    created_at: string
}

class UsersRepository {
    private readonly collection: Collection<User>;
    private readonly collectionName = 'users';

    constructor(dbConnection: Db) {
        this.collection = dbConnection.collection(this.collectionName);
    }

    async findOne(filters: Partial<User>): Promise<User | null> {
        return await this.collection.findOne(filters);
    }

    async insertOne(user: User): Promise<InsertOneResult> {
        return await this.collection.insertOne(user);
    }
    async upsertMany(users: User[]): Promise<BulkWriteResult> {
        const operations: Array<{ updateOne: UpdateOneModel<User> }> =
            users.map((user) => ({
                updateOne: {
                    filter: { identifier: user._id },
                    update: {
                        $set: user,
                    },
                    upsert: true,
                },
            }));
        return await this.collection.bulkWrite(operations);
    }

}

const usersRepository = new UsersRepository(DbSettings.connection);

export default usersRepository