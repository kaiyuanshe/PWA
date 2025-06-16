import { BaseModel, NewData, toggle } from 'mobx-restful';

import { User } from './service';

export class UserSessionModel extends BaseModel {
    @toggle('uploading')
    async updateProfile({
        id = this.user?.id,
        avatar,
        ...data
    }: NewData<User>) {
        const user = await super.updateProfile({ id, ...data });

        await UserSessionModel.upload(
            'user',
            user.id,
            'avatar',
            [avatar],
            'users-permissions'
        );

        return user;
    }
}
