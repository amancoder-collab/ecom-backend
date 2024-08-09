import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getCurrentUserByContext = (
  context: ExecutionContext,
  data: string,
) => {
  if (context.getType() === 'http') {
    if (!data) {
      return context.switchToHttp().getRequest().user;
    }
    return context.switchToHttp().getRequest().user[data];
  }
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData().user;
  }
};

export const CurrentUser = createParamDecorator(
  (data: string, context: ExecutionContext) =>
    getCurrentUserByContext(context, data),
);
