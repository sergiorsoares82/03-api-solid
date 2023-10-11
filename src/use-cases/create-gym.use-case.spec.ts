import { beforeEach, describe, expect, it } from "vitest";
import { CreateGymUseCase } from "./create-gym.use-case";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })

    it('should be possible to create a gym', async () => {
        const { gym } = await sut.execute({
            title: 'Js Gym',
            description: null,
            phone: null,
            latitude: -19.958985,
            longitude: -43.9341315
        })

        expect(gym.id).toEqual(expect.any(String))
    })
})