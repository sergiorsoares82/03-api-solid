import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ValidateCheckInUseCase } from "./validate-check-in.use-case";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be possible to validate check in', async () => {
        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })
        const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id })
        
        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
    })

    it('should not be possible to validate an inexistent check in', async () => {
        await expect(() => sut.execute({ checkInId: 'inexistent-id' }))
            .rejects.toBeInstanceOf(ResourceNotFoundError)
    })

    it('should not be possible to validate check-in 20 minutes after its creation', async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 12, 0))

        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })

        const twentyOneMinutesInMilisseconds = 1000 * 60 * 21
        
        vi.advanceTimersByTime(twentyOneMinutesInMilisseconds)
        
        await expect(() => 
            sut.execute({ checkInId: createdCheckIn.id })
        ).rejects.toBeInstanceOf(LateCheckInValidationError) 

    })
})