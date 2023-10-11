import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUseCase } from "../register.use-case";

export function makeRegisterUseCase() {
    const repository = new PrismaUsersRepository()
    const useCase = new RegisterUseCase(repository)

    return useCase
}