import {
    WebCellProps,
    component,
    mixin,
    watch,
    attribute,
    createCell,
    Fragment
} from 'web-cell';
import { formToJSON } from 'web-utility/source/DOM';
import { observer } from 'mobx-web-cell';
import { NewData } from 'mobx-strapi';

import { InputGroup } from 'boot-cell/source/Form/InputGroup';
import { Button } from 'boot-cell/source/Form/Button';
import { FormField } from 'boot-cell/source/Form/FormField';
import { ScoreRange } from 'boot-cell/source/Form/ScoreRange';
import { Field } from 'boot-cell/source/Form/Field';

import { Evaluation, evaluation, session } from '../model';

export interface EvaluationProps extends WebCellProps {
    program?: string;
    contribution?: string;
}

@observer
@component({
    tagName: 'evaluation-form',
    renderTarget: 'children'
})
export class EvaluationForm extends mixin<EvaluationProps>() {
    @attribute
    @watch
    program?: string;

    @attribute
    @watch
    contribution?: string;

    connectedCallback() {
        evaluation.getAll();

        super.connectedCallback();
    }

    saveEvaluation = (event: Event) => {
        event.preventDefault(), event.stopPropagation();

        return evaluation.update({
            creator: session.user.id,
            program: this.program,
            contribution: this.contribution,
            ...formToJSON<NewData<Evaluation>>(event.target as HTMLFormElement)
        });
    };

    render() {
        const {
            userSubmitted,
            averageScore,
            current: { score, detail }
        } = evaluation;
        const showAll = !session.user || userSubmitted;

        return (
            <form onSubmit={this.saveEvaluation}>
                <FormField label="评分">
                    <ScoreRange
                        className="text-warning"
                        name="score"
                        required
                        value={(showAll ? averageScore : score) + ''}
                        disabled={showAll}
                    />
                </FormField>
                {!session.user ? (
                    <p className="text-muted">登录即可评论</p>
                ) : userSubmitted ? (
                    <FormField label="您的评语">
                        <Field
                            is="output"
                            className="text-white"
                            value={detail}
                        />
                    </FormField>
                ) : (
                    <>
                        <InputGroup>
                            我来说两句
                            <Field is="textarea" name="detail" value={detail} />
                        </InputGroup>
                        <Button className="mt-3" type="submit" color="primary">
                            提交
                        </Button>
                    </>
                )}
            </form>
        );
    }
}
