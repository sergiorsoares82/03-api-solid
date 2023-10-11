import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe('Create Check-in (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be possible to create check-in', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const gym = await prisma.gym.create({
            data: {
                title: 'JavaScript Gym',
                description: 'The Best Gym for JS Developers',
                phone: '11999999999',
                latitude: -19.958985,
                longitude: -43.9341315
            }
        })

        const response = await request(app.server)
            // /gyms/:gymId/check-in
            .post(`/gyms/${gym.id}/check-in`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -19.958985,
                longitude: -43.9341315
            })
        
        expect(response.statusCode).toEqual(201)
    })
})