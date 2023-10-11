import { FetchUserCheckInHistoryUseCase } from "../fetch-user-check-ins-history.use-case";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeFetchUserCheckInsHistoryUseCase() {
    const repository = new PrismaCheckInsRepository()
    const useCase = new FetchUserCheckInHistoryUseCase(repository)

    return useCase
}