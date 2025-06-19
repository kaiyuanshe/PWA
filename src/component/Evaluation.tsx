import { Evaluation } from '@kaiyuanshe/data-server';
import { Button, Field, FormField, InputGroup, ScoreRange } from 'boot-cell';
import { observable } from 'mobx';
import { NewData } from 'mobx-restful';
import {
    attribute,
    component,
    observer,
    reaction,
    WebCell,
    WebCellProps
} from 'web-cell';
import { formToJSON } from 'web-utility';

import { evaluation, session } from '../model';

export interface EvaluationProps extends WebCellProps {
    program?: string;
    contribution?: string;
}

export interface EvaluationForm extends WebCell<EvaluationProps> {}

@component({ tagName: 'evaluation-form' })
@observer
export class EvaluationForm
    extends HTMLElement
    implements WebCell<EvaluationProps>
{
    @attribute
    @observable
    accessor program = '';

    @reaction(({ program }) => program)
    getEvaluation(program: string) {
        evaluation.getAll({ program });
    }

    @attribute
    @observable
    accessor contribution = '';

    saveEvaluation = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();

        return evaluation.updateOne({
            creator: session.user.id,
            program: this.program,
            contribution: this.contribution,
            ...formToJSON<NewData<Evaluation>>(event.target as HTMLFormElement)
        });
    };

    render() {
        const { userSubmitted, averageScore, currentOne } = evaluation;
        const { score, detail } = currentOne,
            showAll = !session.user || userSubmitted;

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
