import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('Todos (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let authToken: string;
  let userId: string;
  let todoId: string;

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

    // Create a test user and get auth token
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const user = await prismaService.user.create({
      data: {
        username: 'todouser',
        password: hashedPassword,
      },
    });
    userId = user.id;

    // Login to get token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: 'todouser',
        password: 'testpassword',
      });
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    // Clean up test data
    if (userId) {
      await prismaService.todo.deleteMany({
        where: {},
      });
      await prismaService.user.delete({
        where: { id: userId },
      });
    }
    await app.close();
  });

  describe('/api/todos (POST)', () => {
    it('should create a todo successfully', () => {
      return request(app.getHttpServer())
        .post('/api/todos')
        .send({
          title: 'Test Todo',
          description: 'Test Description',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('title', 'Test Todo');
          expect(res.body).toHaveProperty('description', 'Test Description');
          expect(res.body).toHaveProperty('done', false);
          todoId = res.body.id;
        });
    });

    it('should create a todo without description', () => {
      return request(app.getHttpServer())
        .post('/api/todos')
        .send({
          title: 'Todo Without Description',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('title', 'Todo Without Description');
          expect(res.body.description).toBeNull();
        });
    });

    it('should fail with missing title', () => {
      return request(app.getHttpServer())
        .post('/api/todos')
        .send({
          description: 'Only description',
        })
        .expect(400);
    });

    it('should fail with empty title', () => {
      return request(app.getHttpServer())
        .post('/api/todos')
        .send({
          title: '',
        })
        .expect(400);
    });
  });

  describe('/api/todos (GET)', () => {
    it('should get all todos with all=true', () => {
      return request(app.getHttpServer())
        .get('/api/todos?all=true')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('count');
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should get paginated todos', () => {
      return request(app.getHttpServer())
        .get('/api/todos?page=1&pageSize=10')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('count');
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should fail without pagination parameters when all=false', () => {
      return request(app.getHttpServer())
        .get('/api/todos')
        .expect(400);
    });
  });

  describe('/api/todos/:id (PUT)', () => {
    it('should update a todo successfully', () => {
      return request(app.getHttpServer())
        .put(`/api/todos/${todoId}`)
        .send({
          title: 'Updated Todo',
          description: 'Updated Description',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', todoId);
          expect(res.body).toHaveProperty('title', 'Updated Todo');
          expect(res.body).toHaveProperty('description', 'Updated Description');
        });
    });

    it('should return 404 for non-existent todo', () => {
      return request(app.getHttpServer())
        .put('/api/todos/non-existent-id')
        .send({
          title: 'Updated Todo',
        })
        .expect(404);
    });
  });

  describe('/api/todos/:id/done (PATCH)', () => {
    it('should toggle todo done status', () => {
      return request(app.getHttpServer())
        .patch(`/api/todos/${todoId}/done`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', todoId);
          expect(res.body).toHaveProperty('done', true);
        });
    });

    it('should toggle todo done status again', () => {
      return request(app.getHttpServer())
        .patch(`/api/todos/${todoId}/done`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('done', false);
        });
    });

    it('should return 404 for non-existent todo', () => {
      return request(app.getHttpServer())
        .patch('/api/todos/non-existent-id/done')
        .expect(404);
    });
  });

  describe('/api/todos/:id (DELETE)', () => {
    let deleteTodoId: string;

    beforeAll(async () => {
      // Create a todo to delete
      const todo = await prismaService.todo.create({
        data: {
          title: 'Todo to Delete',
          description: 'This will be deleted',
        },
      });
      deleteTodoId = todo.id;
    });

    it('should delete a todo successfully', () => {
      return request(app.getHttpServer())
        .delete(`/api/todos/${deleteTodoId}`)
        .expect(200);
    });

    it('should return 404 when trying to delete non-existent todo', () => {
      return request(app.getHttpServer())
        .delete('/api/todos/non-existent-id')
        .expect(404);
    });
  });
});

