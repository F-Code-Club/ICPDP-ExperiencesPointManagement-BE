import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { EventPoint } from "../eventPoint/event-point.entity";
import { FinalPoint } from "../final-point/final-point.entity";

@Entity()
export class Students {
    @PrimaryColumn({ unique: true })
    studentID: string;

    @Column()
    name: string;

    @OneToMany(() => EventPoint, (eventPoint) => eventPoint.student)
    eventPoint?: EventPoint[]

    @OneToMany(() => FinalPoint, (finalPoint) => finalPoint.student)
    finalPoint?: FinalPoint[]
}