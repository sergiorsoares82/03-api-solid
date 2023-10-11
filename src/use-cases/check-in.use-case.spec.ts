import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in.use-case";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)

        await gymsRepository.create({
            id: 'gym-01',
            title: 'JS Gym',
            description: '',
            phone: '',
            latitude: -19.958985,
            longitude: -43.9341315
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be possible to check in', async () => {
        
        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -19.958985,
            userLongitude: -43.9341315
        })

        expect(checkIn.id).toEqual(expect.any(String))
        
    })

    it('should not be possible to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2023, 9, 10, 8, 0, 0))
        
        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -19.958985,
            userLongitude: -43.9341315
        })

        await expect(() => sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -19.958985,
            userLongitude: -43.9341315
        })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it('should be possible to check in twice in different days', async () => {
        vi.setSystemTime(new Date(2023, 9, 9, 8, 0, 0))
        
        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -19.958985,
            userLongitude: -43.9341315
        })

        vi.setSystemTime(new Date(2023, 9, 10, 8, 0, 0))
        const {checkIn} = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -19.958985,
            userLongitude: -43.9341315
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('it should not be able to check in on distant gym', async () => {
        gymsRepository.items.push({
            id: 'gym-02',
            title: 'Node Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-19.9422439),
            longitude: new Decimal(-43.9352902)
        })
        
        await expect(() => sut.execute({
            userId: 'user-01',
            gymId: 'gym-02',
            userLatitude: -19.958985,
            userLongitude: -43.9341315
        })).rejects.toBeInstanceOf(MaxDistanceError)
    })
})