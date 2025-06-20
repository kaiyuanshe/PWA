import { Evaluation } from '@kaiyuanshe/data-server';
import {
    Button,
    FormControl,
    FormField,
    InputGroup,
    RangeInput
} from 'boot-cell';
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

import { t } from '../i18n';
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
                <FormField label={t('score')}>
                    <RangeInput
                        className="text-warning"
                        icon={value => (value ? '★' : '☆')}
                        name="score"
                        required
                        min={0}
                        max={5}
                        value={(showAll ? averageScore : score) + ''}
                        disabled={showAll}
                    />
                </FormField>
                {!session.user ? (
                    <p className="text-muted">{t('loginToComment')}</p>
                ) : userSubmitted ? (
                    <FormField label={t('yourComment')}>
                        <output className="text-white" value={detail} />
                    </FormField>
                ) : (
                    <>
                        <InputGroup>
                            {t('saySomething')}
                            <FormControl
                                as="textarea"
                                name="detail"
                                value={detail}
                            />
                        </InputGroup>
                        <Button className="mt-3" type="submit" color="primary">
                            {t('submit')}
                        </Button>
                    </>
                )}
            </form>
        );
    }
}
