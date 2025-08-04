import { Body, Controller, Get, Inject, Param, Post, Query, UseGuards } from "../../core/decorators";
import { Roles, RolesGuard } from "../guards/roles.guard";
import { UsersService } from "./users.service";
import { BooksService } from "../books/books.service";

@Controller('/users')
// @UseGuards(RolesGuard) // застосовуємо глобально до всіх методів контролера
export class UsersController {
     constructor(
        @Inject(UsersService) private svc:UsersService,
         private bsvc:BooksService        
    ){}

      @Get('/')
  one(@Query('id') id:string) {
  console.log('Get Query')  
    return this.svc.findOne(+id);
  }

  @Get('/')
  @Roles('admin')
  list() {
    return this.svc.findAll();
  }


  @Post('/')
  // @UsePipes(ZodValidationPipe)
  add(@Body() body: { name: string }) {
    console.log('post')
    return this.svc.create(body.name);
  }
  @Get('/books')
  listBooks(){
    console.log('listBooks')
    return this.bsvc.findAll()
  }


}