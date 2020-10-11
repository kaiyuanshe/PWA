import { observable } from 'mobx';
import { UsersGetByUsernameResponseData } from '@octokit/types';

import { User, service, setToken, APIError, github } from './service';
import { NewData } from './Base';

export class SessionModel {
    @observable
    user?: User;

    @observable
    userGithub?: UsersGetByUsernameResponseData;

    async signIn(token: string, provider = 'github') {
        const {
            body: { jwt, user }
        } = await service.get<{ jwt: string; user: User }>(
            `auth/${provider}/callback?access_token=${token}`
        );
        setToken(jwt);
        return (this.user = user);
    }

    signOut() {
        setToken('');
        self.location.replace('');
    }

    async getProfile() {
        try {
            const { body } = await service.get<User>('users/me');

            return (this.user = body);
        } catch (error) {
            if ((error as APIError).status !== 400) throw error;
        }
    }

    async getGithubProfile(name: string) {
        const { body } = await github.get<UsersGetByUsernameResponseData>(
            'users/' + name
        );
        return (this.userGithub = body);
    }

    async updateProfile({ id = this.user?.id, ...data }: NewData<User>) {
        const { body } = await service.put<User>('users/' + id, data);

        return (this.user = body);
    }
}
