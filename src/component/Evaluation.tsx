import { component, mixin, createCell } from 'web-cell';
import { InputGroup } from 'boot-cell/source/Form/InputGroup';
import { Button } from 'boot-cell/source/Form/Button';
import { FormField } from 'boot-cell/source/Form/FormField';
import { formToJSON } from 'web-utility/source/DOM';

import { evaluation } from '../model';
@component({
    tagName: 'evaluation-form',
    renderTarget: 'children'
})
export class Evaluation extends mixin() {
    saveEvaluation = async (event: Event) => {
        const { creator } = await evaluation.update(
            formToJSON((event.target as HTMLButtonElement).form)
        );
        self.alert(`${creator.username} 的评价已提交`);
    };

    render() {
        return (
            <form onSubmit={this.saveEvaluation}>
                <FormField
                    type="range"
                    label="评分"
                    name="score"
                    max={5}
                    emptyIcon="☆"
                    fullIcon="★"
                    size="lg"
                    color="warning"
                />
                <InputGroup is="textarea" name="detail" prepend="我来说两句" />
                <Button className="mt-3" onClick={this.saveEvaluation}>
                    提交
                </Button>
            </form>
        );
    }
}
