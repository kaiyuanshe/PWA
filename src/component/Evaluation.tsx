import {
    component,
    mixin,
    watch,
    attribute,
    createCell,
    Fragment
} from 'web-cell';
import { formToJSON } from 'web-utility/source/DOM';
import { InputGroup } from 'boot-cell/source/Form/InputGroup';
import { Button } from 'boot-cell/source/Form/Button';
import { FormField } from 'boot-cell/source/Form/FormField';

import { evaluation, session } from '../model';

export interface EvaluationProps {
    program?: number;
    contribution?: number;
}

@component({
    tagName: 'evaluation-form',
    renderTarget: 'children'
})
export class Evaluation extends mixin<EvaluationProps>() {
    @attribute
    @watch
    program?: number;

    @attribute
    @watch
    contribution?: number;

    connectedCallback() {
        evaluation.getAll();

        super.connectedCallback();
    }

    saveEvaluation = async (event: Event) => {
        event.preventDefault(), event.stopPropagation();

        const { creator } = await evaluation.update({
            creator: session.user.id,
            program: this.program,
            contribution: this.contribution,
            ...formToJSON(event.target as HTMLFormElement)
        });
        self.alert(`${creator.username} 的评价已提交`);
    };

    render() {
        const { averageScore, userEvaluation } = evaluation;

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
                    defaultValue={
                        !session.user || userEvaluation
                            ? averageScore + ''
                            : '0'
                    }
                    disabled={!session.user}
                />
                {!session.user ? (
                    <p className="text-muted">登录即可评论</p>
                ) : !userEvaluation ? (
                    <>
                        <InputGroup
                            is="textarea"
                            name="detail"
                            prepend="我来说两句"
                        />
                        <Button className="mt-3" type="submit">
                            提交
                        </Button>
                    </>
                ) : (
                    <FormField
                        is="output"
                        label="您的评语"
                        value={userEvaluation.detail}
                    />
                )}
            </form>
        );
    }
}
