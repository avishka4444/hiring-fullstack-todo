import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { GetTodosRequestDto, GetTodosResponseDto } from './dto/get-todos.dto';
import { TodoDto } from './dto/todo.dto';

@ApiTags('todos')
@Controller('api/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new TODO item' })
  @ApiBody({ type: CreateTodoDto })
  @ApiResponse({
    status: 201,
    description: 'The TODO item has been successfully created',
    type: TodoDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  async create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a TODO item (title/description)' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the TODO item to update',
    type: String,
  })
  @ApiBody({ type: UpdateTodoDto })
  @ApiResponse({
    status: 200,
    description: 'The TODO item has been successfully updated',
    type: TodoDto,
  })
  @ApiResponse({
    status: 404,
    description: 'TODO item not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Patch(':id/done')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle the done status of a TODO item' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the TODO item to toggle',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The TODO item done status has been successfully toggled',
    type: TodoDto,
  })
  @ApiResponse({
    status: 404,
    description: 'TODO item not found',
  })
  async updateDone(@Param('id') id: string) {
    return this.todosService.toggleDone(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all TODO items with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Returns a paginated list of TODO items',
    type: GetTodosResponseDto,
  })
  async getAll(@Query() getTodosDto: GetTodosRequestDto) {
    return this.todosService.getAll(getTodosDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a TODO item' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the TODO item to delete',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The TODO item has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'TODO item not found',
  })
  async delete(@Param('id') id: string) {
    return this.todosService.delete(id);
  }
}
