import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LocalFile {
    @PrimaryGeneratedColumn("uuid")
    localFileID: string;

    @Column()
    diskPath: string;

    @Column()
    fileName: string;

    @CreateDateColumn()
    createdAt: Date;
}