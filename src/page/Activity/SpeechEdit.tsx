import { Button, FilePicker, FormCheck, FormField } from 'boot-cell';
import { observable } from 'mobx';
import {
    attribute,
    component,
    observer,
    WebCell,
    WebCellProps
} from 'web-cell';
import { formToJSON, Minute } from 'web-utility';

import { t } from '../../i18n';
import {
    activity,
    category,
    organization,
    program,
    project,
    session
} from '../../model';

export interface SpeechEditPageProps extends WebCellProps {
    aid: string;
    pid?: string;
}

export interface SpeechEditPage extends WebCell<SpeechEditPageProps> {}

@component({ tagName: 'speech-edit-page' })
@observer
export class SpeechEditPage
    extends HTMLElement
    implements WebCell<SpeechEditPageProps>
{
    @attribute
    @observable
    accessor aid = 0;

    @attribute
    @observable
    accessor pid = 0;

    connectedCallback() {
        const { aid } = this;

        if (aid !== activity.currentOne.id) activity.getOne(aid);

        category.getAll();
        project.getAll();
        organization.getAll();
    }

    async save(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        const { title } = await program.updateOne(
            formToJSON(event.target as HTMLFormElement)
        );
        self.alert(t('topicSubmitted', { title }));

        location.hash = '';
    }

    render() {
        const { aid } = this,
            { user } = session,
            { startTime } = activity.currentOne;
        const endTime = new Date(+new Date(startTime) + 40 * Minute).toJSON();

        return (
            <form className="container" onSubmit={this.save}>
                <h1 className="h2 my-4">{t('topicApply')}</h1>

                <input type="hidden" name="activity" value={aid + ''} />
                <input type="hidden" name="startTime" value={startTime} />
                <input type="hidden" name="endTime" value={endTime} />
                <input type="hidden" name="mentors" value={user?.id} />

                <FormField
                    name="title"
                    required
                    label={t('topicTitle')}
                    labelColumn={2}
                />
                <FormField
                    is="textarea"
                    name="summary"
                    required
                    minLength={5}
                    label={t('intro')}
                    labelColumn={2}
                />
                <FormField label={t('type')} labelColumn={2}>
                    <FormCheck
                        type="radio"
                        name="type"
                        value="lecture"
                        required
                        inline
                        className="h-100 align-items-center"
                        label={t('lecture')}
                    />
                    <FormCheck
                        type="radio"
                        name="type"
                        value="workshop"
                        required
                        inline
                        className="h-100 align-items-center"
                        label={t('workshop')}
                    />
                </FormField>
                <FormField
                    is="select"
                    name="category"
                    required
                    label={t('category')}
                    labelColumn={2}
                >
                    {category.allItems.map(({ id, name }) => (
                        <option key={`category-${id}`} value={id + ''}>
                            {name}
                        </option>
                    ))}
                </FormField>
                <FormField label={t('document')} labelColumn={2}>
                    <FilePicker
                        type="file"
                        name="documents"
                        multiple
                        accept=".doc,.docx,.ppt,.pptx,.pdf,.odt,.odp"
                        label={t('documentLabel')}
                        fileButton={t('select')}
                    />
                </FormField>
                <FormField
                    is="select"
                    name="project"
                    label={t('relatedProject')}
                    labelColumn={2}
                >
                    <option value="">{t('none')}</option>
                    {project.allItems.map(({ id, name }) => (
                        <option key={`project-${id}`} value={id + ''}>
                            {name}
                        </option>
                    ))}
                </FormField>
                <FormField
                    is="select"
                    name="organization"
                    label={t('relatedOrg')}
                    labelColumn={2}
                >
                    <option value="">{t('none')}</option>
                    {organization.allItems.map(({ id, name }) => (
                        <option key={`organization-${id}`} value={id + ''}>
                            {name}
                        </option>
                    ))}
                </FormField>
                <footer className="my-4 text-center">
                    <Button type="submit" color="success" className="mr-3">
                        {t('submit')}
                    </Button>
                    <Button
                        type="reset"
                        color="danger"
                        onClick={() => (location.hash = '')}
                    >
                        {t('discard')}
                    </Button>
                </footer>
            </form>
        );
    }
}
