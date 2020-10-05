import { observable } from 'mobx';
import { User, service, setToken } from './service';

export class SessionModel {
    @observable
    user?: User;

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
        const { body } = await service.get<User>('users/me');

        return (this.user = body);
    }
}