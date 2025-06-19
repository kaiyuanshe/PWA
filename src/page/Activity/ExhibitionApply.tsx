import { Project } from '@kaiyuanshe/data-server';
import {
    Button,
    FileInput,
    FormField,
    Step,
    TabPanel,
    TabView
} from 'boot-cell';
import debounce from 'lodash.debounce';
import { observable } from 'mobx';
import { NewData } from 'mobx-restful';
import {
    attribute,
    component,
    observer,
    WebCell,
    WebCellProps
} from 'web-cell';
import { formToJSON } from 'web-utility';

import { activity, organization, program, project, session } from '../../model';

export interface ExhibitionApplyProps extends WebCellProps {
    aid: number;
}

export interface ExhibitionApply extends WebCell<ExhibitionApplyProps> {}

@component({ tagName: 'exhibition-apply' })
@observer
export class ExhibitionApply
    extends HTMLElement
    implements WebCell<ExhibitionApplyProps>
{
    @attribute
    @observable
    accessor aid = '';

    @attribute
    @observable
    accessor step = 0;

    @attribute
    @observable
    accessor organization = '';

    connectedCallback() {
        this.classList.add('d-block', 'container');

        if (this.aid !== activity.currentOne.id) activity.getOne(+this.aid);
    }

    handleBack = (event: Event) => {
        event.stopPropagation();

        this.step = 0;
        this.organization = '';
    };

    searchOrganization = debounce(
        ({ data }: InputEvent) => data && organization.searchBy('name', data),
        500
    );

    selectOrganization({ target }: Event) {
        const { value } = target as HTMLInputElement;

        if (organization.currentOne.name !== value)
            organization.select('name', value);
    }

    saveOrganization = async (event: Event) => {
        event.preventDefault(), event.stopPropagation();

        if (organization.downloading > 0) return;

        const { type, target } = event;

        const { id, name } = await organization.updateOne(
            formToJSON(
                type === 'submit'
                    ? (target as HTMLFormElement)
                    : (target as HTMLButtonElement).form
            )
        );
        if (type !== 'submit') return (this.step = 2);

        await program.updateOne({
            activity: this.aid,
            organization: id,
            type: 'exhibition',
            title: name,
            mentors: [session.user.id]
        });
        self.alert(`展示组织 ${name} 的展位申请已提交`);

        history.back();
    };

    renderOrganization() {
        const { currentPage, currentOne, downloading } = organization;
        const loading = downloading > 0,
            { id, slogan, summary, logo, link, messageLink } = currentOne;

        return (
            <form onSubmit={this.saveOrganization} onReset={this.handleBack}>
                <input type="hidden" name="id" value={(id ?? 0) + ''} />
                <FormField
                    type="search"
                    name="name"
                    required
                    label="名称"
                    placeholder="可搜索已注册组织"
                    list="organization-list"
                    onInput={this.searchOrganization}
                    onChange={this.searchOrganization}
                    onBlur={this.selectOrganization}
                />
                <datalist id="organization-list">
                    {currentPage.map(({ name }) => (
                        <option value={name} />
                    ))}
                </datalist>
                <FormField name="slogan" label="标语" value={slogan ?? ''} />
                <FormField
                    is="textarea"
                    name="summary"
                    label="简介"
                    value={summary ?? ''}
                />
                <FormField label="标识">
                    <FileInput name="logo" value={logo?.url} />
                </FormField>
                <FormField
                    type="url"
                    name="link"
                    label="官方网址"
                    value={link ?? ''}
                />
                <FormField
                    type="url"
                    name="message_link"
                    label="即时通讯链接"
                    placeholder="加群二维码、公众平台账号等对应的链接"
                    value={messageLink ?? ''}
                />
                <div className="text-center">
                    <Button
                        className="px-4 mr-3"
                        type="submit"
                        color="success"
                        disabled={loading}
                    >
                        提交组织
                    </Button>
                    <Button
                        className="px-4 mr-3"
                        color="primary"
                        disabled={loading}
                        onClick={this.saveOrganization}
                    >
                        展示项目
                    </Button>
                    <Button
                        className="px-4"
                        type="reset"
                        color="danger"
                        disabled={loading}
                    >
                        返回
                    </Button>
                </div>
            </form>
        );
    }

    searchProject = debounce(
        ({ data }: InputEvent) => data && project.searchBy('name', data),
        500
    );

    selectProject({ target }: Event) {
        const { value } = target as HTMLInputElement;

        if (project.currentOne.name !== value) project.select('name', value);
    }

    saveProject = async (event: Event) => {
        event.preventDefault(), event.stopPropagation();

        if (project.downloading > 0) return;

        const { id: uid } = session.user,
            members = project.currentOne.members?.map(({ id }) => id),
            { organization } = this;

        const { end_date, ...data } = formToJSON<NewData<Project>>(
            event.target as HTMLFormElement
        );
        const { id, name } = await project.updateOne({
            end_date: end_date || undefined,
            members:
                members &&
                (members.includes(uid) ? members : [...members, uid]),
            organization: organization || undefined,
            ...data
        });
        await program.updateOne({
            activity: this.aid,
            project: id,
            type: 'exhibition',
            title: name,
            mentors: [uid]
        });
        self.alert(`展示项目 ${name} 的展位申请已提交`);

        history.back();
    };

    renderProject() {
        const { currentPage, currentOne, downloading } = project;
        const loading = downloading > 0,
            { id = 0, summary, logo, link } = currentOne;

        return (
            <form onSubmit={this.saveProject} onReset={this.handleBack}>
                <input type="hidden" name="id" value={id + ''} />
                <FormField
                    type="search"
                    name="name"
                    required
                    label="名称"
                    placeholder="可搜索已注册项目"
                    list="project-list"
                    onInput={this.searchProject}
                    onChange={this.searchProject}
                    onBlur={this.selectProject}
                />
                <datalist id="project-list">
                    {currentPage.map(({ name }) => (
                        <option value={name} />
                    ))}
                </datalist>
                <FormField
                    is="textarea"
                    name="summary"
                    label="简介"
                    value={summary ?? ''}
                />
                <FormField
                    type="date"
                    name="start_date"
                    required
                    label="发起日期"
                />
                <FormField type="date" name="end_date" label="结束日期" />
                <FormField label="标识">
                    <FileInput name="logo" value={logo?.url} />
                </FormField>
                <FormField
                    type="url"
                    name="link"
                    label="官方网址"
                    value={link ?? ''}
                />
                <div className="text-center">
                    <Button
                        className="px-4 mr-3"
                        type="submit"
                        color="success"
                        disabled={loading}
                    >
                        提交项目
                    </Button>
                    <Button
                        className="px-4"
                        type="reset"
                        color="danger"
                        disabled={loading}
                    >
                        返回
                    </Button>
                </div>
            </form>
        );
    }

    render() {
        const { step } = this,
            { description } = activity.currentOne;

        return (
            <>
                <h2 className="mt-5 mb-4">开源市集 展位申请</h2>

                <TabView linear activeIndex={step}>
                    <Step icon={1}>参展单位</Step>
                    <TabPanel className="text-center">
                        <Button
                            className="px-5 m-3"
                            color="warning"
                            size="lg"
                            onClick={() => (this.step = 2)}
                        >
                            个人
                        </Button>
                        <Button
                            className="px-5"
                            color="primary"
                            size="lg"
                            onClick={() => (this.step = 1)}
                        >
                            组织
                        </Button>
                        <article
                            className="text-left"
                            innerHTML={description}
                        />
                    </TabPanel>

                    <Step icon={2}>组织信息</Step>
                    <TabPanel>{this.renderOrganization()}</TabPanel>

                    <Step icon={3}>项目信息</Step>
                    <TabPanel>{this.renderProject()}</TabPanel>
                </TabView>
            </>
        );
    }
}
