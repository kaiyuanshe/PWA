import { Button, FileInput, FormField } from 'boot-cell';
import { NewData } from 'mobx-restful';
import { component, observer } from 'web-cell';
import { formToJSON } from 'web-utility';

import { session, User } from '../model';

@component({ tagName: 'profile-page' })
@observer
export class ProfilePage extends HTMLElement {
    handleSync = (event: MouseEvent) => {
        event.preventDefault();

        return session.getGithubProfile(session.user.username);
    };

    handleSubmit = async (event: Event) => {
        event.preventDefault();
        event.stopPropagation();

        if (session.downloading > 0) return;

        const { mobilePhone, ...user } = formToJSON<NewData<User>>(
            event.target as HTMLFormElement
        );
        await session.updateProfile({ mobilePhone: mobilePhone + '', ...user });

        return (location.hash = '');
    };

    render() {
        const { user, userGithub, downloading } = session;
        const loading = downloading > 0,
            { id, name, username, email, mobilePhone, summary, avatar } =
                user || {},
            { name: nickname, bio, avatar_url } = userGithub || {};

        return (
            <form className="container my-5" onSubmit={this.handleSubmit}>
                <input type="hidden" name="id" value={id} />

                <h2>用户基本信息</h2>

                <div className="row mt-4">
                    <FormField
                        className="col-12 col-sm-6 col-md-3"
                        name="name"
                        required
                        label="昵称"
                        value={nickname || name}
                    />
                    <FormField
                        className="col-12 col-sm-6 col-md-3"
                        is="output"
                        name="username"
                        label="用户名"
                        value={username}
                    />
                    <FormField
                        className="col-12 col-sm-6 col-md-3"
                        is="output"
                        name="email"
                        label="电邮地址"
                        value={email}
                    />
                    <FormField
                        className="col-12 col-sm-6 col-md-3"
                        type="tel"
                        name="mobilePhone"
                        label="手机号码"
                        value={mobilePhone}
                    />
                    <FormField
                        className="col-12 col-sm-8"
                        is="textarea"
                        name="summary"
                        label="个人简介"
                        value={bio || summary}
                    />
                    <FormField className="col-12 col-sm-4" label="头像">
                        <FileInput
                            name="avatar"
                            required
                            value={avatar_url || avatar?.url}
                        />
                    </FormField>
                </div>
                <Button
                    className="mr-3"
                    color="primary"
                    size="lg"
                    disabled={loading}
                    onClick={this.handleSync}
                >
                    同步 GitHub
                </Button>
                <Button
                    type="submit"
                    color="success"
                    size="lg"
                    disabled={loading}
                >
                    保存
                </Button>
            </form>
        );
    }
}
