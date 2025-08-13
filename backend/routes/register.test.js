const request = require('supertest');
const app = require('../app'); // Import your express app

describe('POST /register', () => {
  it('should validate and store registration on valid input', async () => {
    const payload = {
      step1: {
        aadhaarNumber: "123412341234",
        entrepreneurName: "Tester",
        consent: true
      },
      step2: {
        orgType: "Proprietorship",
        panNumber: "ABCDE1234F",
        panHolderName: "Tester",
        dobOrDoi: "1999-01-01",
        consent: true
      }
    };
    const res = await request(app).post('/register').send(payload);
    expect(res.body.success).toBe(true);
    expect(res.body.id).toBeDefined();
  });

  it('should reject invalid PAN', async () => {
    const payload = { /*...with an invalid panNumber...*/ };
    payload.step2 = {...payload.step2, panNumber: "BADPAN123"};
    const res = await request(app).post('/register').send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid/i);
  });
});
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

