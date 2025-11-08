import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Clean up test data
    if (userId) {
      await prismaService.user.deleteMany({
        where: {
          username: {
            in: ['testuser', 'testuser2', 'loginuser'],
          },
        },
      });
    }
    await app.close();
  });

  describe('/api/auth/register (POST)', () => {
    it('should register a new user successfully', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('username', 'testuser');
          expect(res.body).not.toHaveProperty('password');
          userId = res.body.id;
        });
    });

    it('should fail with duplicate username', async () => {
      // First registration
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          password: 'password123',
        })
        .expect(201);

      // Duplicate registration
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          password: 'password123',
        })
        .expect(409);
    });

    it('should fail with invalid data (missing username)', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          password: 'password123',
        })
        .expect(400);
    });

    it('should fail with invalid data (missing password)', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          username: 'testuser3',
        })
        .expect(400);
    });

    it('should fail with short password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          username: 'testuser3',
          password: 'short',
        })
        .expect(400);
    });

    it('should fail with short username', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          username: 'ab',
          password: 'password123',
        })
        .expect(400);
    });
  });

  describe('/api/auth/login (POST)', () => {
    beforeAll(async () => {
      // Create a user for login tests
      const hashedPassword = await bcrypt.hash('loginpassword', 10);
      const user = await prismaService.user.create({
        data: {
          username: 'loginuser',
          password: hashedPassword,
        },
      });
      userId = user.id;
    });

    it('should login successfully with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'loginuser',
          password: 'loginpassword',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
          expect(res.body).toHaveProperty('tokenType', 'Bearer');
          expect(res.body.token).toBeTruthy();
          authToken = res.body.token;
        });
    });

    it('should fail with incorrect username', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'loginpassword',
        })
        .expect(401);
    });

    it('should fail with incorrect password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'loginuser',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should fail with missing username', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          password: 'loginpassword',
        })
        .expect(400);
    });

    it('should fail with missing password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'loginuser',
        })
        .expect(400);
    });

    it('should fail with short password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'loginuser',
          password: 'short',
        })
        .expect(400);
    });
  });
});

