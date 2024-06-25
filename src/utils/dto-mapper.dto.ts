import { ClassConstructor, plainToInstance } from "class-transformer";

export class DtoMapper {
    static mapOne<T, V>(entity: V, clazz: ClassConstructor<T>, cb?: (transformedData: T) => T): T {
        const data = plainToInstance(clazz, entity, { enableCircularCheck: true, enableImplicitConversion: true, excludeExtraneousValues: true });
        return cb ? cb(data) : data;
    }
    
    static mapMany<T, U>(entities: T[], dtoClass: new () => U): U[] {
        return entities.map(entity => {
            const dto = new dtoClass();

            // Map user properties to DTO for club and department [GET]
            if (entity.hasOwnProperty('user')) {
                const user = entity['user'];
                dto['userID'] = user['userID'];
                dto['username'] = user['username'];
                dto['password'] = user['password'];
                dto['email'] = user['email'];
                dto['role'] = user['role'];
            }

            // Map student properties to DTO for eventPoint [GET]
            if (entity.hasOwnProperty('student') && entity['student'] !== null) {
                const student = entity['student'];
                dto['studentID'] = student['studentID'];
            }

            // Map club properties to DTO for event [GET]
            if (entity.hasOwnProperty('club') && entity['club'] !== null) {
                const club = entity['club'];
                dto['clubName'] = club['name'];
            }

            // Map department properties to DTO for event [GET]
            if (entity.hasOwnProperty('department') && entity['department'] !== null) {
                const department = entity['department'];
                dto['departmentName'] = department['name'];
            }

            // Map the properties from entity to DTO (id is the primarykey of eventPoint table)
            Object.keys(entity).forEach(key => {
                if (key !== 'user' && key !=='createdAt' && key !== 'id' && key !=='event' && key !== 'student' && key !=='club' && key !=='department' && entity.hasOwnProperty(key)) {
                    dto[key] = entity[key];
                }
            });

            return dto;
        });
    }
}