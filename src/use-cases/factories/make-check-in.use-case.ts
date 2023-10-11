import { CheckInUseCase } from "../check-in.use-case";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeCheckInUseCase() {
    const checkInRepository = new PrismaCheckInsRepository()
    const gymRepository = new PrismaGymsRepository()
    const useCase = new CheckInUseCase(checkInRepository, gymRepository)

    return useCase
}