import { UserCreateController } from "@/user/v1/infrastructure/controllers/user.create.controller";
import { UserDeleteController } from "@/user/v1/infrastructure/controllers/user.delete.controller";
import { UserUpdateController } from "@/user/v1/infrastructure/controllers/user.update.controller";
import { UserLoginController } from "@/user/v1/infrastructure/controllers/user.login.controller";
import { UserFindAllController } from "@/user/v1/infrastructure/controllers/user.find.all.controller";
import { UserFindController } from "@/user/v1/infrastructure/controllers/user.find.controller";

const Controllers = [
  UserCreateController,
  UserDeleteController,
  UserFindAllController,
  UserFindController,
  UserLoginController,
  UserUpdateController,
];

export default Controllers.map((Controller) => new Controller());
