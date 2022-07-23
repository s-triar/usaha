import { Inject, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UserLoggedIn } from '@usaha/api-interfaces';
import { User } from '../../typeorm/entities/auth';

export const CURRENT_USER = Inject('CURRENT_USER');

export interface RequestWithUser extends Request {
  // user:User;
  user: UserLoggedIn
}

@Module({
    providers: [{
      provide: CURRENT_USER,
      inject: [REQUEST],
      useFactory: (req: Request):RequestWithUser => {
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rreq = (req) as RequestWithUser;
          // console.log("user loggedin",rreq.user);
        return rreq;
      },
      scope: Scope.REQUEST,
    }],
    exports: [CURRENT_USER],
  })
  export class CurrentUserModule {}