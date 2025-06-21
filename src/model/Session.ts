import { NewData, toggle } from 'mobx-restful';
import { SessionModel } from 'mobx-strapi';

import { User } from './service';

export class UserSessionModel extends SessionModel<User> {
    @toggle('uploading')
    async updateProfile({
        id = this.user?.id,
        avatar,
        ...data
    }: NewData<User>) {
        const user = await super.updateProfile({ id, ...data });

        await this.upload(
            'user',
            user.documentId,
            'avatar',
            // @ts-expect-error Type compatibility bug
            [avatar],
            'users-permissions'
        );

        return user;
    }
}

export default new UserSessionModel();
