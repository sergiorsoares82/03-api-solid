import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms.use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function search(request:FastifyRequest, reply: FastifyReply) {
    const searchGymsQuerySchema = z.object({
        query: z.string(),
        page: z.coerce.number().min(1).default(1) // query params vêm como string
    })

    const { query, page } = searchGymsQuerySchema.parse(request.query)

    const searchGymUseCase = makeSearchGymsUseCase()

    const { gyms } = await searchGymUseCase.execute({
        query,
        page
    })
    
    return reply.status(200).send({ gyms })
}