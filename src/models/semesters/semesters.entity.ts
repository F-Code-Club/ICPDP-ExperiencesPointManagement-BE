import { BeforeInsert, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { PointBoard } from "../point-board/pointBoard.entity";

@Entity()
export class Semesters {
    @PrimaryColumn()
    semesterID: string;

    @Column()
    semester: string;

    @Column()
    year: number;

    @Column({ type: 'varchar', length: 10})
    startDate: string;

    @Column({ type: 'varchar', length: 10})
    endDate: string;

    @OneToMany(() => PointBoard, (pointBoard) => pointBoard.semester)
    pointBoard?: PointBoard[]

    @BeforeInsert()
    setSemesterID() {
        this.semesterID = `${this.semester}${this.year}`;
    }
}