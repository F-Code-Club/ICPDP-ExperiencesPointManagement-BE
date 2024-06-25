import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { EventPoint } from "../eventPoint/event-point.entity";

@Entity()
export class Students {
    @PrimaryColumn({ unique: true })
    studentID: string;

    @Column()
    name: string;

    @OneToMany(() => EventPoint, (eventPoint) => eventPoint.student)
    eventPoint?: EventPoint[]
}