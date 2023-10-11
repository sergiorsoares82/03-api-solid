import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { SearchGymUseCase } from "../search-gyms.use-case";

export function makeSearchGymsUseCase() {
    const repository = new PrismaGymsRepository()
    const useCase = new SearchGymUseCase(repository)

    return useCase
}