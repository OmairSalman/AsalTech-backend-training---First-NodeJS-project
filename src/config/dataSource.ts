import { DataSource } from "typeorm";
import { User } from "../models/userEntity";
import { Post } from "../models/postEntity";
import { Comment } from "../models/commentEntity";
import 'dotenv/config';

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DATABASE_HOST,
    port: 3306,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User, Post, Comment],
    synchronize: true,
    logging: false,
});

export default AppDataSource;