import {Module} from "../../core/decorators";

import {BooksService} from "../books/books.service";
import { UsersService } from "./users.service";
import {UsersController} from "./users.controller";
import { BooksModule } from "../books/books.module";

@Module({
  imports:[BooksModule],
  controllers: [UsersController],
  providers:   [BooksService,UsersService],
})
export class UsersModule {}