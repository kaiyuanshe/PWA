import { component, mixin, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { formToJSON } from 'web-utility/source/DOM';
import { FormField } from 'boot-cell/source/Form/FormField';
import { FileInput } from 'boot-cell/source/Form/FileInput';
import { Button } from 'boot-cell/source/Form/Button';

import { history, session } from '../model';

@observer
@component({
    tagName: 'profile-page',
    renderTarget: 'children'
})
export class ProfilePage extends mixin() {
    handleSync = (event: MouseEvent) => {
        event.preventDefault();

        return session.getGithubProfile(session.user.username);
    };

    handleSubmit = async (event: Event) => {
        event.preventDefault(), event.stopPropagation();

        if (session.loading) return;

        await session.updateProfile(
            formToJSON(event.target as HTMLFormElement)
        );
        return history.push('');
    };

    render() {
        const { user, userGithub, loading } = session;
        const { id, name, username, email, summary, avatar } = user || {},
            { name: nickname, bio, avatar_url } = userGithub || {};

        return (
            <form className="container my-5" onSubmit={this.handleSubmit}>
                <input type="hidden" name="id" value={id} />

                <h2>用户基本信息</h2>

                <div className="row mt-4">
                    <FormField
                        className="col-12 col-sm-4"
                        name="name"
                        required
                        label="昵称"
                        value={nickname || name}
                    />
                    <FormField
                        className="col-12 col-sm-4"
                        is="output"
                        name="username"
                        label="用户名"
                        value={username}
                    />
                    <FormField
                        className="col-12 col-sm-4"
                        is="output"
                        name="email"
                        label="电邮地址"
                        value={email}
                    />
                </div>
                <div className="row">
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
