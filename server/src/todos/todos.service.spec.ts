import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { GetTodosRequestDto } from './dto/get-todos.dto';

describe('TodosService', () => {
  let service: TodosService;

  const mockPrismaService = {
    todo: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a todo successfully', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
      };

      const mockTodo = {
        id: 'todo-id',
        title: 'Test Todo',
        description: 'Test Description',
        done: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.todo.create.mockResolvedValue(mockTodo);

      const result = await service.create(createTodoDto);

      expect(mockPrismaService.todo.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Todo',
          description: 'Test Description',
        },
      });
      expect(result).toEqual(mockTodo);
    });

    it('should create a todo without description', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
      };

      const mockTodo = {
        id: 'todo-id',
        title: 'Test Todo',
        description: null,
        done: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.todo.create.mockResolvedValue(mockTodo);

      const result = await service.create(createTodoDto);

      expect(mockPrismaService.todo.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Todo',
          description: undefined,
        },
      });
      expect(result).toEqual(mockTodo);
    });
  });

  describe('update', () => {
    it('should update a todo successfully', async () => {
      const todoId = 'todo-id';
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      const existingTodo = {
        id: todoId,
        title: 'Original Title',
        description: 'Original Description',
        done: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedTodo = {
        ...existingTodo,
        title: 'Updated Title',
        description: 'Updated Description',
      };

      mockPrismaService.todo.findUnique.mockResolvedValue(existingTodo);
      mockPrismaService.todo.update.mockResolvedValue(updatedTodo);

      const result = await service.update(todoId, updateTodoDto);

      expect(mockPrismaService.todo.findUnique).toHaveBeenCalledWith({
        where: { id: todoId },
      });
      expect(mockPrismaService.todo.update).toHaveBeenCalledWith({
        where: { id: todoId },
        data: {
          title: 'Updated Title',
          description: 'Updated Description',
          done: undefined,
        },
      });
      expect(result).toEqual(updatedTodo);
    });

    it('should throw NotFoundException if todo does not exist', async () => {
      const todoId = 'non-existent-id';
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Title',
      };

      mockPrismaService.todo.findUnique.mockResolvedValue(null);

      await expect(service.update(todoId, updateTodoDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.todo.update).not.toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should return all todos when all=true', async () => {
      const getTodosDto: GetTodosRequestDto = { all: true };
      const mockTodos = [
        {
          id: 'todo-1',
          title: 'Todo 1',
          description: 'Description 1',
          done: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'todo-2',
          title: 'Todo 2',
          description: 'Description 2',
          done: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.todo.count.mockResolvedValue(2);
      mockPrismaService.todo.findMany.mockResolvedValue(mockTodos);

      const result = await service.getAll(getTodosDto);

      expect(mockPrismaService.todo.count).toHaveBeenCalled();
      expect(mockPrismaService.todo.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result.count).toBe(2);
      expect(result.data).toEqual(mockTodos);
    });

    it('should return paginated todos when all=false', async () => {
      const getTodosDto: GetTodosRequestDto = {
        all: false,
        page: 1,
        pageSize: 10,
      };
      const mockTodos = [
        {
          id: 'todo-1',
          title: 'Todo 1',
          description: 'Description 1',
          done: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.todo.count.mockResolvedValue(1);
      mockPrismaService.todo.findMany.mockResolvedValue(mockTodos);

      const result = await service.getAll(getTodosDto);

      expect(mockPrismaService.todo.count).toHaveBeenCalled();
      expect(mockPrismaService.todo.findMany).toHaveBeenCalled();
      expect(result.count).toBe(1);
      expect(result.data).toEqual(mockTodos);
    });
  });

  describe('getOne', () => {
    it('should return a todo by id', async () => {
      const todoId = 'todo-id';
      const mockTodo = {
        id: todoId,
        title: 'Test Todo',
        description: 'Test Description',
        done: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.todo.findUnique.mockResolvedValue(mockTodo);

      const result = await service.getOne(todoId);

      expect(mockPrismaService.todo.findUnique).toHaveBeenCalledWith({
        where: { id: todoId },
      });
      expect(result).toEqual(mockTodo);
    });

    it('should throw NotFoundException if todo does not exist', async () => {
      const todoId = 'non-existent-id';

      mockPrismaService.todo.findUnique.mockResolvedValue(null);

      await expect(service.getOne(todoId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleDone', () => {
    it('should toggle todo from false to true', async () => {
      const todoId = 'todo-id';
      const existingTodo = {
        id: todoId,
        title: 'Test Todo',
        description: 'Test Description',
        done: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedTodo = {
        ...existingTodo,
        done: true,
      };

      mockPrismaService.todo.findUnique.mockResolvedValue(existingTodo);
      mockPrismaService.todo.update.mockResolvedValue(updatedTodo);

      const result = await service.toggleDone(todoId);

      expect(mockPrismaService.todo.findUnique).toHaveBeenCalledWith({
        where: { id: todoId },
      });
      expect(mockPrismaService.todo.update).toHaveBeenCalledWith({
        where: { id: todoId },
        data: {
          done: true,
        },
      });
      expect(result).toEqual(updatedTodo);
    });

    it('should toggle todo from true to false', async () => {
      const todoId = 'todo-id';
      const existingTodo = {
        id: todoId,
        title: 'Test Todo',
        description: 'Test Description',
        done: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedTodo = {
        ...existingTodo,
        done: false,
      };

      mockPrismaService.todo.findUnique.mockResolvedValue(existingTodo);
      mockPrismaService.todo.update.mockResolvedValue(updatedTodo);

      const result = await service.toggleDone(todoId);

      expect(mockPrismaService.todo.update).toHaveBeenCalledWith({
        where: { id: todoId },
        data: {
          done: false,
        },
      });
      expect(result).toEqual(updatedTodo);
    });

    it('should throw NotFoundException if todo does not exist', async () => {
      const todoId = 'non-existent-id';

      mockPrismaService.todo.findUnique.mockResolvedValue(null);

      await expect(service.toggleDone(todoId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a todo successfully', async () => {
      const todoId = 'todo-id';
      const existingTodo = {
        id: todoId,
        title: 'Test Todo',
        description: 'Test Description',
        done: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.todo.findUnique.mockResolvedValue(existingTodo);
      mockPrismaService.todo.delete.mockResolvedValue(existingTodo);

      await service.delete(todoId);

      expect(mockPrismaService.todo.findUnique).toHaveBeenCalledWith({
        where: { id: todoId },
      });
      expect(mockPrismaService.todo.delete).toHaveBeenCalledWith({
        where: { id: todoId },
      });
    });

    it('should throw NotFoundException if todo does not exist', async () => {
      const todoId = 'non-existent-id';

      mockPrismaService.todo.findUnique.mockResolvedValue(null);

      await expect(service.delete(todoId)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.todo.delete).not.toHaveBeenCalled();
    });
  });
});

