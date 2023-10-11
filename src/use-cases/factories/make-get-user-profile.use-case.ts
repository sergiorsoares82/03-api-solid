import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetUserProfileUseCase } from "../get-user-profile.use-case";

export function MakeGetUserProfileUseCase() {
    const repository = new PrismaUsersRepository()
    const useCase = new GetUserProfileUseCase(repository)

    return useCase
}