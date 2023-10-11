import { beforeEach, describe, expect, it } from "vitest"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { SearchGymUseCase } from "./search-gyms.use-case"

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase

describe('Search Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymUseCase(gymsRepository)
    })

    it('should be possible to search for gyms', async () => {
        await gymsRepository.create({
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            latitude: -19.958985,
            longitude: -43.9341315
        })

        await gymsRepository.create({
            title: 'TypeScript Gym',
            description: null,
            phone: null,
            latitude: -19.958985,
            longitude: -43.9341315
        })

        const { gyms } = await sut.execute({ query: 'Script', page: 1 })
        
        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym' }),
            expect.objectContaining({ title: 'TypeScript Gym' })
        ])
    })

    it('should be able to fetch paginated gyms search', async () => {
        for (let index = 1; index <= 22 ; index++) {
            await gymsRepository.create({
                title: `JavaScript Gym ${index}`,
                description: null,
                phone: null,
                latitude: -19.958985,
                longitude: -43.9341315
            })       
        }

        const { gyms } = await sut.execute({ query: 'Script', page: 2 })
        
        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym 21' }),
            expect.objectContaining({ title: 'JavaScript Gym 22' })
        ])
    })
})