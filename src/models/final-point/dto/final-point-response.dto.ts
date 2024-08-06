import { Expose, Type } from "class-transformer";
import { ActivityPoint, CitizenshipPoint, OrganizationPoint, StudyPoint } from "../final-point.entity";


export class FinalPointResponseDto {
    @Expose()
    studentID: string;

    @Expose()
    @Type(() => StudyPoint)
    studyPoint: StudyPoint;

    @Expose()
    @Type(() => ActivityPoint)
    activityPoint: ActivityPoint;

    @Expose()
    @Type(() => CitizenshipPoint)
    citizenshipPoint: CitizenshipPoint;

    @Expose()
    @Type(() => OrganizationPoint)
    organizationPoint: OrganizationPoint;
}