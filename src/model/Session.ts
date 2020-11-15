import { SessionModel, NewData, loading } from 'mobx-strapi';

import { User } from './service';

export class UserSessionModel extends SessionModel<User> {
    @loading
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
