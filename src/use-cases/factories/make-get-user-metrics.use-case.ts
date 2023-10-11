import { GetUserMetricsUseCase } from "../get-user-metrics.use-case";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeGetUserMetricsUseCase() {
    const repository = new PrismaCheckInsRepository()
    const useCase = new GetUserMetricsUseCase(repository)

    return useCase
}