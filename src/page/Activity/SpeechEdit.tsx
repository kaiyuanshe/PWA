import { Button, Field, FormField, ToggleField } from 'boot-cell';
import { observable } from 'mobx';
import {
    attribute,
    component,
    observer,
    WebCell,
    WebCellProps
} from 'web-cell';
import { formToJSON, Minute } from 'web-utility';

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
    accessor aid = '';

    @attribute
    @observable
    accessor pid = '';

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
        self.alert(`您的《${title}》讲题已提交，请静候组织者审核~`);

        location.hash = '';
    }

    render() {
        const { aid } = this,
            { user } = session,
            { start_time } = activity.currentOne;
        const end_time = new Date(+new Date(start_time) + 40 * Minute).toJSON();

        return (
            <form className="container" onSubmit={this.save}>
                <h1 className="h2 my-4">讲题申报</h1>

                <input type="hidden" name="activity" value={aid + ''} />
                <input type="hidden" name="start_time" value={start_time} />
                <input type="hidden" name="end_time" value={end_time} />
                <input type="hidden" name="mentors" value={user?.id} />

                <FormField name="title" required label="题目" labelColumn={2} />
                <FormField
                    is="textarea"
                    name="summary"
                    required
                    minLength={5}
                    label="简介"
                    labelColumn={2}
                />
                <FormField label="类型" labelColumn={2}>
                    <ToggleField
                        type="radio"
                        name="type"
                        value="lecture"
                        required
                        inline
                        className="h-100 align-items-center"
                    >
                        演讲
                    </ToggleField>
                    <ToggleField
                        type="radio"
                        name="type"
                        value="workshop"
                        required
                        inline
                        className="h-100 align-items-center"
                    >
                        动手训练营（工作坊）
                    </ToggleField>
                </FormField>
                <FormField
                    is="select"
                    name="category"
                    required
                    label="分类"
                    labelColumn={2}
                >
                    {category.allItems.map(({ id, name }) => (
                        <option key={`category-${id}`} value={id}>
                            {name}
                        </option>
                    ))}
                </FormField>
                <FormField label="文档" labelColumn={2}>
                    <Field
                        type="file"
                        name="documents"
                        multiple
                        accept=".doc,.docx,.ppt,.pptx,.pdf,.odt,.odp"
                        label="Word 文档、PPT、PDF、开放文档格式"
                        fileButton="选择"
                    />
                </FormField>
                <FormField
                    is="select"
                    name="project"
                    label="相关项目"
                    labelColumn={2}
                >
                    <option value="">（暂无）</option>
                    {project.allItems.map(({ id, name }) => (
                        <option key={`project-${id}`} value={id}>
                            {name}
                        </option>
                    ))}
                </FormField>
                <FormField
                    is="select"
                    name="organization"
                    label="相关组织"
                    labelColumn={2}
                >
                    <option value="">（暂无）</option>
                    {organization.allItems.map(({ id, name }) => (
                        <option key={`organization-${id}`} value={id}>
                            {name}
                        </option>
                    ))}
                </FormField>
                <footer className="my-4 text-center">
                    <Button type="submit" color="success" className="mr-3">
                        提交
                    </Button>
                    <Button
                        type="reset"
                        color="danger"
                        onClick={() => (location.hash = '')}
                    >
                        放弃
                    </Button>
                </footer>
            </form>
        );
    }
}
