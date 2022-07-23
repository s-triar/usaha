import { EventSubscriber, EntitySubscriberInterface, DataSource, InsertEvent } from 'typeorm';
import { User } from '../../typeorm/entities/auth';
// import { CURRENT_USER } from '../auth/current-user.module';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    dataSource: DataSource, 
    // private usersService:UserService,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // @Inject(CURRENT_USER) private readonly currentUser: any
    ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>):Promise<void> {
    // TODO CHECKING EXISTING USER
    console.log(`BEFORE USER INSERTED: `, event.entity);
    // const candidate = event.entity;
    
    // event.entity.created_by = null;
    // return event;
  }
  // async beforeUpdate(event: UpdateEvent<User>): Promise<UpdateEvent<User>> {
  //   event.entity.updated_by = null;
  //   return event;
  // }
  // async beforeSoftRemove(event: SoftRemoveEvent<User>): Promise<SoftRemoveEvent<User>> {
  //   event.entity.deleted_by = null;
  //   return event;
  // }
  afterInsert(event: InsertEvent<User>){
    // TODO SEND EMAIL CONFIRMATION
    console.log(`AFTER USER INSERTED: `, event.entity);

  }
}