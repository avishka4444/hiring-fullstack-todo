import { PaginatePropsMixin } from '../../common/types/paginate-props';
import { PaginatedResponse } from '../../common/types/paginated-response';
import { TodoDto } from './todo.dto';

export class GetTodosRequestDto extends PaginatePropsMixin(class {} as any) {}

export class GetTodosResponseDto extends PaginatedResponse(TodoDto) {}
