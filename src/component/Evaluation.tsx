import {
    component,
    mixin,
    watch,
    attribute,
    createCell,
    Fragment
} from 'web-cell';
import { observer } from 'mobx-web-cell';
import { InputGroup } from 'boot-cell/source/Form/InputGroup';
import { Button } from 'boot-cell/source/Form/Button';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Field } from 'boot-cell/source/Form/Field';

import { evaluation, session } from '../model';

export interface EvaluationProps {
    program?: string;
    contribution?: string;
}

@observer
@component({
    tagName: 'evaluation-form',
    renderTarget: 'children'
})
export class Evaluation extends mixin<EvaluationProps>() {
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

    saveEvaluation = async (event: Event) => {
        event.preventDefault(), event.stopPropagation();

        const { score, detail } = evaluation.current;

        return evaluation.update({
            creator: session.user.id,
            program: this.program,
            contribution: this.contribution,
            score,
            detail
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
                <FormField
                    type="range"
                    name="score"
                    required
                    max={5}
                    emptyIcon="☆"
                    fullIcon="★"
                    size="lg"
                    color="warning"
                    label="评分"
                    value={(showAll ? averageScore : score) + ''}
                    disabled={showAll}
                    onChange={({ target }) =>
                        evaluation.setCurrent({
                            score: +(target as HTMLInputElement).value
                        })
                    }
                />
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
                        <InputGroup
                            is="textarea"
                            name="detail"
                            prepend="我来说两句"
                            value={detail}
                            onChange={({ target }) =>
                                evaluation.setCurrent({
                                    detail: (target as HTMLInputElement).value
                                })
                            }
                        />
                        <Button className="mt-3" type="submit">
                            提交
                        </Button>
                    </>
                )}
            </form>
        );
    }
}
