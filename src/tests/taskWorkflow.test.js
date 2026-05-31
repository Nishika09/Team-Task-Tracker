
const request = require('supertest');
const app = require('../app');

describe('Task Status Workflow', () => {

    let managerToken;
    let taskId;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'manager@test.com',
                password: 'Password123'
            });

        managerToken = loginResponse.body.data.accessToken;
        taskId = 1;
    });

    test('Should reject invalid status transition', async () => {
        const response = await request(app)
            .patch(`/ api / tasks / ${taskId}/status`).set(
                'Authorization',
                `Bearer ${managerToken}`
            )
            .send({
                status: 'DONE'
            });

        expect(response.status).toBe(400);

        expect(response.body.message)
            .toContain('Invalid status transition');
    });

});