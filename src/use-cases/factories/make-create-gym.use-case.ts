import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CreateGymUseCase } from "../create-gym.use-case";

export function makeCreateGymUseCase() {
    const repository = new PrismaGymsRepository()
    const useCase = new CreateGymUseCase(repository)

    return useCase
}