import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { GetTodosRequestDto, GetTodosResponseDto } from './dto/get-todos.dto';
import PrismaUtil from '../common/util/prisma.util';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async create(createTodoDto: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        title: createTodoDto.title,
        description: createTodoDto.description,
      },
    });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return this.prisma.todo.update({
      where: { id },
      data: {
        title: updateTodoDto.title,
        description: updateTodoDto.description,
        done: updateTodoDto.done,
      },
    });
  }

  async getAll(getTodosDto: GetTodosRequestDto): Promise<GetTodosResponseDto> {
    const { all } = getTodosDto;

    const count = await this.prisma.todo.count();

    let todos;
    if (all) {
      todos = await this.prisma.todo.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      const pagination = PrismaUtil.paginate(getTodosDto);
      todos = await this.prisma.todo.findMany({
        ...pagination,
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return new GetTodosResponseDto(count, todos);
  }

  async toggleDone(id: string) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return this.prisma.todo.update({
      where: { id },
      data: {
        done: !todo.done,
      },
    });
  }

  async delete(id: string) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    await this.prisma.todo.delete({
      where: { id },
    });
  }
}
