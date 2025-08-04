import {Module} from "../../core/decorators";

import {BooksService} from "./books.service";
import {BooksController} from "./books.controller";
import { UsersController } from "../users/users.controller";
import { UsersModule } from "../users/users.module";

@Module({
  // imports:[UsersModule],
  controllers: [BooksController],
  providers:   [BooksService],
  exports: [BooksService]
})
export class BooksModule {}