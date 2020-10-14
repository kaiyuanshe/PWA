import { observable } from 'mobx';
import { UsersGetByUsernameResponseData } from '@octokit/types';

import { User, APIError, service, setToken, github } from './service';
import { BaseModel, NewData, pending } from './Base';

export class SessionModel extends BaseModel {
    @observable
    user?: User;

    @observable
    userGithub?: UsersGetByUsernameResponseData;

    @pending
    async signIn(token: string, provider = 'github') {
        const {
            body: {
                jwt,
                user: { id }
            }
        } = await service.get<{ jwt: string; user: User }>(
            `auth/${provider}/callback?access_token=${token}`
        );
        setToken(jwt);

        return this.getProfile((self.localStorage.userID = id));
    }

    signOut() {
        self.localStorage.clear();
        self.location.replace('');
    }

    @pending
    async getProfile(id = this.user?.id || self.localStorage.userID) {
        try {
            const { body } = await service.get<User>(`users/${id || 'me'}`);

            return (this.user = body);
        } catch (error) {
            if ((error as APIError).status !== 400) throw error;
        }
    }

    @pending
    async getGithubProfile(name: string) {
        const { body } = await github.get<UsersGetByUsernameResponseData>(
            'users/' + name
        );
        return (this.userGithub = body);
    }

    @pending
    async updateProfile({
        id = this.user?.id,
        avatar,
        ...data
    }: NewData<User>) {
        const { body } = await service.put<User>('users/' + id, data);

        await SessionModel.upload(
            'user',
            body.id,
            'avatar',
            [avatar],
            'users-permissions'
        );
        return (this.user = body);
    }
}
