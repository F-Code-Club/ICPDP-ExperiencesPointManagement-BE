import { ApiProperty } from "@nestjs/swagger";
import { ActivityPoint, CitizenshipPoint, OrganizationPoint, StudyPoint } from "../final-point.entity";

export class FinalPointUpdateDto {
    @ApiProperty({
        description: 'Study points',
        type: () => StudyPoint,
        example: { 
            extraPoint: 0, 
            comment: '' 
        }
    })
    studyPoint: StudyPoint;

    @ApiProperty({
        description: 'Activity points',
        type: () => ActivityPoint,
        example: {
            extraPoint1: 0,
            extraPoint2: 0,
            extraPoint3: 0,
            extraPoint4: 0,
            extraPoint5: 0
        }
    })
    activityPoint: ActivityPoint;

    @ApiProperty({
        description: 'Citizenship points',
        type: () => CitizenshipPoint,
        example: { extraPoint: 0, comment: '' }
    })
    citizenshipPoint: CitizenshipPoint;

    @ApiProperty({
        description: 'Organization points',
        type: () => OrganizationPoint,
        example: { extraPoint: 0, comment: '' }
    })
    organizationPoint: OrganizationPoint;
}
