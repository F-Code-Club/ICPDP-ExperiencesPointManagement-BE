import { ClassConstructor, plainToInstance } from "class-transformer";

export class DtoMapper {
    static mapOne<T, V>(entity: V, clazz: ClassConstructor<T>, cb?: (transformedData: T) => T): T {
        const data = plainToInstance(clazz, entity, { enableCircularCheck: true, enableImplicitConversion: true, excludeExtraneousValues: true });
        return cb ? cb(data) : data;
    }
    
    static mapMany<T, U>(entities: T[], dtoClass: new () => U): U[] {
        return entities.map(entity => {
            const dto = new dtoClass();

            // Map user properties to DTO
            if (entity.hasOwnProperty('user')) {
                const user = entity['user'];
                dto['userID'] = user['userID'];
                dto['username'] = user['username'];
                dto['password'] = user['password'];
                dto['email'] = user['email'];
                dto['role'] = user['role'];
            }

            // Map the properties from entity to DTO
            Object.keys(entity).forEach(key => {
                if (key !== 'user' && key !=='createdAt' && entity.hasOwnProperty(key)) {
                    dto[key] = entity[key];
                }
            });

            return dto;
        });
    }
}