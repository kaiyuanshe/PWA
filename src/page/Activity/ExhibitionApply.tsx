import { ProgramTypeEnum3, Project } from '@kaiyuanshe/data-server';
import { Button, FilePicker, FormField, Tab, Tabs } from 'boot-cell';
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

import { t } from '../../i18n';
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
    accessor aid = 0;

    @attribute
    @observable
    accessor step = 0;

    @attribute
    @observable
    accessor organization = '';

    connectedCallback() {
        this.classList.add('d-block', 'container');

        if (this.aid !== activity.currentOne.id) activity.getOne(this.aid);
    }

    handleBack = (event: Event) => {
        event.stopPropagation();

        this.step = 0;
        this.organization = '';
    };

    searchOrganization = debounce(
        ({ data }: InputEvent) => data && organization.search(data),
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
            type: 'exhibition' as ProgramTypeEnum3,
            title: name,
            // @ts-expect-error Type compatibility bug
            mentors: [session.user.id]
        });
        self.alert(t('organization', { name }));

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
                    label={t('name')}
                    placeholder={t('searchOrgPlaceholder')}
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
                <FormField
                    name="slogan"
                    label={t('slogan')}
                    value={slogan ?? ''}
                />
                <FormField
                    is="textarea"
                    name="summary"
                    label={t('intro')}
                    value={summary ?? ''}
                />
                <FormField label={t('logo')}>
                    <FilePicker
                        name="logo"
                        accept="image/*"
                        defaultValue={logo?.url}
                    />
                </FormField>
                <FormField
                    type="url"
                    name="link"
                    label={t('website')}
                    value={link ?? ''}
                />
                <FormField
                    type="url"
                    name="message_link"
                    label={t('imLink')}
                    placeholder={t('imLinkPlaceholder')}
                    value={messageLink ?? ''}
                />
                <div className="text-center">
                    <Button
                        className="px-4 mr-3"
                        type="submit"
                        color="success"
                        disabled={loading}
                    >
                        {t('submitOrg')}
                    </Button>
                    <Button
                        className="px-4 mr-3"
                        color="primary"
                        disabled={loading}
                        onClick={this.saveOrganization}
                    >
                        {t('showProject')}
                    </Button>
                    <Button
                        className="px-4"
                        type="reset"
                        color="danger"
                        disabled={loading}
                    >
                        {t('back')}
                    </Button>
                </div>
            </form>
        );
    }

    searchProject = debounce(
        ({ data }: InputEvent) => data && project.search(data),
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
            type: 'exhibition' as ProgramTypeEnum3,
            title: name,
            // @ts-expect-error Type compatibility bug
            mentors: [uid]
        });
        self.alert(t('projectBoothSubmitted', { name }));

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
                    label={t('name')}
                    placeholder={t('searchProjectPlaceholder')}
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
                    label={t('intro')}
                    value={summary ?? ''}
                />
                <FormField
                    type="date"
                    name="start_date"
                    required
                    label={t('startDate')}
                />
                <FormField type="date" name="end_date" label={t('endDate')} />
                <FormField label={t('logo')}>
                    <FilePicker
                        name="logo"
                        accept="image/*"
                        defaultValue={logo?.url}
                    />
                </FormField>
                <FormField
                    type="url"
                    name="link"
                    label={t('website')}
                    value={link ?? ''}
                />
                <div className="text-center">
                    <Button
                        className="px-4 mr-3"
                        type="submit"
                        color="success"
                        disabled={loading}
                    >
                        {t('submitProject')}
                    </Button>
                    <Button
                        className="px-4"
                        type="reset"
                        color="danger"
                        disabled={loading}
                    >
                        {t('back')}
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
                <h2 className="mt-5 mb-4">{t('marketBoothApply')}</h2>

                <Tabs>
                    <Tab
                        caption={`(1) ${t('exhibitionUnit')}`}
                        className="text-center"
                    >
                        <Button
                            className="px-5 m-3"
                            color="warning"
                            size="lg"
                            onClick={() => (this.step = 2)}
                        >
                            {t('individual')}
                        </Button>
                        <Button
                            className="px-5"
                            color="primary"
                            size="lg"
                            onClick={() => (this.step = 1)}
                        >
                            {t('organization')}
                        </Button>
                        <article
                            className="text-left"
                            innerHTML={description}
                        />
                    </Tab>
                    <Tab caption={t('orgInfo')}>
                        {this.renderOrganization()}
                    </Tab>
                    <Tab caption={t('projectInfo')}>{this.renderProject()}</Tab>
                </Tabs>
            </>
        );
    }
}
