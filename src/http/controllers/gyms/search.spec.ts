import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe('Search Gym (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be possible to search gyms', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'Js Gym',
            description: 'The Best Gym for JS Developers',
            phone: '119999999999',
            latitude: -19.958985,
            longitude: -43.9341315
        })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Ts Gym',
                description: 'The Best Gym for TS Developers',
                phone: '119999999999',
                latitude: -19.958985,
                longitude: -43.9341315
            })

        const response = await request(app.server)
            .get('/gyms/search')
            .query({
                query: 'Js'
            })
            .set('Authorization', `Bearer ${token}`)
            .send()
        
        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({ title: 'Js Gym' })
        ])
    })
})