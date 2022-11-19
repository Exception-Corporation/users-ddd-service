import { UserCreateController } from '@/user/v1/infrastructure/controllers/user.create.controller';
import { UserDeleteController } from '@/user/v1/infrastructure/controllers/user.delete.controller';
import { UserUpdateController } from '@/user/v1/infrastructure/controllers/user.update.controller';
import { UserLoginController } from '@/user/v1/infrastructure/controllers/user.login.controller';
import { UserFindAllController } from '@/user/v1/infrastructure/controllers/user.find.all.controller';
import { UserFindController } from '@/user/v1/infrastructure/controllers/user.find.controller';
import { UserMissingPasswordController } from '@/user/v1/infrastructure/controllers/user.missing.password.controller';
import { ControllerParams } from '@/shared/infrastructure/controller/decorators/controller';

const Controllers = [
  UserCreateController,
  UserDeleteController,
  UserFindAllController,
  UserFindController,
  UserLoginController,
  UserUpdateController,
  UserMissingPasswordController
];

export default Controllers.map((Controller) => {
  const controller = new Controller();
  type ControllerType = typeof controller & ControllerParams;

  return controller as ControllerType;
});
