import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe('Check-in History (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be possible to list check-ins history', async () => {
        const { token } = await createAndAuthenticateUser(app)
        
        const user = await prisma.user.findFirstOrThrow()
        
        const gym = await prisma.gym.create({
            data: {
                title: 'JavaScript Gym',
                description: 'The Best Gym for JS Developers',
                phone: '11999999999',
                latitude: -19.958985,
                longitude: -43.9341315
            }
        })

        await prisma.checkIn.createMany({
            data: [{
                gym_id: gym.id,
                user_id: user.id
            }, 
            { 
                gym_id: gym.id,
                user_id: user.id
            }]
        })

        const response = await request(app.server)
            .get(`/check-ins/history`)
            .set('Authorization', `Bearer ${token}`)
            .send()
        
        expect(response.statusCode).toEqual(200)
        expect(response.body.checkIns).toEqual([
            expect.objectContaining({
                gym_id: gym.id,
                user_id: user.id
            }),
            expect.objectContaining({
                gym_id: gym.id,
                user_id: user.id
            })
        ])
    })
})