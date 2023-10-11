import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe('Nearby Gym (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be possible to search nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app, true)
        
        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Near Gym',
                description: null,
                phone: null,
                latitude: -19.958985,
                longitude: -43.9341315
        })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Far Gym',
                description: null,
                phone: null,
                latitude: -19.8468004,
                longitude: -44.009825
            })

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -19.958985,
                longitude: -43.9341315
            })
            .set('Authorization', `Bearer ${token}`)
            .send()
        
        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({ title: 'Near Gym' })
        ])
    })
})