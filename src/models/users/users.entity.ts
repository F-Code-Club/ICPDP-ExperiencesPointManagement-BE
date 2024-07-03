import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn("uuid")
    userID: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @Column()
    avatar: string;

    @Column()
    iv?: string;  //code to encode and decode password

    @Column()
    role: string;

    @Column({ length: 512 })
    refreshToken?: string;
};
