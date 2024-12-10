import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../../user/domain/user';

export const ActiveUser = createParamDecorator(
  (
    property: keyof User | undefined,
    ctx: ExecutionContext,
  ): User | User[keyof User] => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return property ? user?.[property] : user;
  },
);
