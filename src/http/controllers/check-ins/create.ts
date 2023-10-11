import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in.use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createCheckInParamsSchema = z.object({
        gymId: z.string().uuid()
    })
    
    const createCheckInBodySchema = z.object({
        // userId: z.string(),
        latitude: z.number().refine(value => Math.abs(value) <= 90),
        longitude: z.number().refine(value => Math.abs(value) <= 180)
    })

    const { gymId } = createCheckInParamsSchema.parse(request.params)

    const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

    const createCheckInUseCase = makeCheckInUseCase()

    await createCheckInUseCase.execute({
        userId: request.user.sub,
        gymId,
        userLatitude: latitude,
        userLongitude: longitude
    })

    return reply.status(201).send()
}