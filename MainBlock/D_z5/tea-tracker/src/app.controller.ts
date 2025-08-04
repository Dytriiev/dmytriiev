import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BrewModel } from './app.service';
import {
  BrewDTO,
  BrewDTOSchema,
  GetTeaDto,
  PaginateQuery,
  ResPag,
  TeaDto,
  UpdateDTO,
  UpdateDTOSchema,
} from './dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ZBody } from './decorators/zod.validation';
import { Public } from './decorators/public';

@Controller('tea')
export class AppController {
  constructor(private readonly appService: BrewModel) {}
  @Public()
  @Get()
  @ApiCreatedResponse({
    type: ResPag,
  })
  @ApiOperation({ summary: 'Get paginated brews with filtering' })
  @ApiQuery({
    name: 'minRating',
    required: false,
    description: 'Minimum rating filter',
    example: '4',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: '1',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: '10',
    type: String,
  })
  getAll(@Query() query?: PaginateQuery) {
    const result = this.appService.get(query);
    return {
      result,
    };
  }

  @Get('/:id')
  @ApiCreatedResponse({
    type: GetTeaDto,
  })
  getById(@Param('id') id: string) {
    return this.appService.find(id);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post()
  @ApiBody({
    type: TeaDto,
    description: 'Данные для создания нового чая',
  })
  @ApiCreatedResponse({
    type: GetTeaDto,
  })
  createBrew(@ZBody(BrewDTOSchema) body: BrewDTO) {
    return this.appService.create(body);
  }

  @Put('/:id')
  @ApiBody({
    type: TeaDto,
    description: 'Update',
  })
  @ApiCreatedResponse({
    type: GetTeaDto,
  })
  updateBrew(
    @ZBody(UpdateDTOSchema) body: UpdateDTO,
    @Param('id') id: string,
  ) {
    return this.appService.update(id, body);
  }

  @Delete('/:id')
  @ApiCreatedResponse({
    type: GetTeaDto,
  })
  deleteBrew(@Param('id') id: string) {
    return this.appService.remove(id);
  }
}
