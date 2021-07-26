import {
    WebCellProps,
    component,
    mixin,
    watch,
    attribute,
    createCell
} from 'web-cell';
import { formToJSON } from 'web-utility/source/DOM';

import { Button } from 'boot-cell/source/Form/Button';
import { Field } from 'boot-cell/source/Form/Field';
import { FormField } from 'boot-cell/source/Form/FormField';
import { ToggleField } from 'boot-cell/source/Form/ToggleField';

import { session } from '../../model';

export interface SpeechEditPageProps extends WebCellProps {
    aid: number;
    pid?: number;
}

@component({
    tagName: 'speech-edit-page',
    renderTarget: 'children'
})
export class SpeechEditPage extends mixin<SpeechEditPageProps>() {
    @attribute
    @watch
    aid: number;

    @attribute
    @watch
    pid?: number;

    save = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();

        console.log(formToJSON(event.target as HTMLFormElement));
    };

    render() {
        const { aid } = this,
            { user } = session;

        return (
            <form className="container" onSubmit={this.save}>
                <h1 className="h2 my-4">讲题申报</h1>

                <input type="hidden" name="activity" value={aid + ''} />
                <input type="hidden" name="mentors" value={user?.id} />

                <FormField name="title" required label="题目" labelColumn={2} />
                <FormField
                    is="textarea"
                    name="summary"
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
                <FormField label="文档" labelColumn={2}>
                    <Field
                        type="file"
                        name="documents"
                        multiple
                        // @ts-ignore
                        accept=".doc,.docx,.ppt,.pptx,.pdf,.odt,.odp"
                        label="Word 文档、PPT、PDF、开放文档格式"
                        fileButton="选择"
                    />
                </FormField>
                <footer className="my-4 text-center">
                    <Button type="submit" color="success" className="mr-3">
                        提交
                    </Button>
                    <Button type="reset" color="danger">
                        清空
                    </Button>
                </footer>
            </form>
        );
    }
}
