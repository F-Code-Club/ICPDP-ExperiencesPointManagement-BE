import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password?: string;

    @Column({ unique: true })
    email: string;

    @Column()
    avt: string;

    @Column()
    iv?: string;  //code to encode and decode password

    @Column()
    role: string;

    @Column()
    refreshToken?: string;
};
