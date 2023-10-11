import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate.use-case";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)
    })

    it('should be able to authenticate', async () => {
        const email = 'sergio@gmail.com'
        const password = '123456'

        await usersRepository.create({
            name: "Sergio Soares",
            email,
            password_hash: await hash(password, 6)
        })

        const { user } = await sut.execute({ email, password })
        
        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async () => {
        const email = 'sergio@gmail.com'
        const password = '123456'

        await usersRepository.create({ name: "Sergio Soares", email, password_hash: await hash(password, 6) })
        
        await expect(() => sut.execute({ email: 'notsergio@gmail.com', password })).rejects.toBeInstanceOf(InvalidCredentialsError) 
    })

    it('should not be able to authenticate with wrong password', async () => {
        const email = 'sergio@gmail.com'
        const password = '123456'

        await usersRepository.create({ name: "Sergio Soares", email, password_hash: await hash(password, 6) })
        
        await expect(() => sut.execute({ email, password: '123123' })).rejects.toBeInstanceOf(InvalidCredentialsError) 
    })
})