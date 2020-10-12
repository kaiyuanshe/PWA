import { observable } from 'mobx';
import { UsersGetByUsernameResponseData } from '@octokit/types';

import { User, APIError, service, setToken, github } from './service';
import { BaseModel, NewData } from './Base';

export class SessionModel extends BaseModel {
    @observable
    user?: User;

    @observable
    userGithub?: UsersGetByUsernameResponseData;

    async signIn(token: string, provider = 'github') {
        this.loading = true;

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

    async getProfile(id = this.user?.id || self.localStorage.userID) {
        this.loading = true;
        try {
            const { body } = await service.get<User>(`users/${id || 'me'}`);

            return (this.user = body);
        } catch (error) {
            if ((error as APIError).status !== 400) throw error;
        } finally {
            this.loading = false;
        }
    }

    async getGithubProfile(name: string) {
        this.loading = true;

        const { body } = await github.get<UsersGetByUsernameResponseData>(
            'users/' + name
        );
        this.loading = false;
        return (this.userGithub = body);
    }

    async updateProfile({
        id = this.user?.id,
        avatar,
        ...data
    }: NewData<User>) {
        this.loading = true;

        const { body } = await service.put<User>('users/' + id, data);

        await SessionModel.upload(
            'user',
            body.id,
            'avatar',
            [avatar],
            'users-permissions'
        );
        this.loading = false;
        return (this.user = body);
    }
}
