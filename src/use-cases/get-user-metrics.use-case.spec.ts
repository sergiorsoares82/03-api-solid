import { beforeEach, describe, expect, it } from "vitest";
import { GetUserMetricsUseCase } from "./get-user-metrics.use-case";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new GetUserMetricsUseCase(checkInsRepository)
    })

    it('should be possible to get check ins count form metrics', async () => {
        for (let index = 0; index < 2; index++) {
            await checkInsRepository.create({
                user_id: 'user-01',
                gym_id: `gym-${index}`
            })
        }

        const { checkInsCount } = await sut.execute({ userId: 'user-01' })
        expect(checkInsCount).toEqual(2)
    })
})