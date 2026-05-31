const request = require('supertest');
const app = require('../app');

describe('RBAC Enforcement', () => {

    let memberToken;
    let taskId;

    beforeAll(async () => {

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'member@test.com',
                password: 'Password123'
            });

        memberToken =
            loginResponse.body.data.accessToken;

        taskId = 1;
    });

    test('Member should not update another user task', async () => {

        const response = await request(app)
            .patch(`/api/tasks/${taskId}/status`)
            .set(
                'Authorization',
                `Bearer ${memberToken}`
            )
            .send({
                status: 'IN_PROGRESS'
            });

        expect(response.status).toBe(403);
    });

});