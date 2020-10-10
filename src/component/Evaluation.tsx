import { component, mixin, createCell } from 'web-cell';
import { InputGroup } from 'boot-cell/source/Form/InputGroup';
import { Button } from 'boot-cell/source/Form/Button';

import style from './Evaluation.module.less';

@component({
    tagName: 'evaluation-form',
    renderTarget: 'children'
})
export class Evaluation extends mixin() {
    showCurrent = async (event: MouseEvent) => {
        let list = ['one', 'two', 'three', 'four', 'five'],
            rate = list.indexOf((event.target as HTMLElement).id);

        for (let i = 0; i <= rate; i++) {
            let element = list[i];
            let cls = document.getElementById(element).className;
            if (cls.includes(style.checked)) continue;
            else document.getElementById(element).classList.add(style.checked);
        }
        if (rate < 4) {
            for (let i = rate + 1; i < 5; i++) {
                let element = list[i];
                let cls = document.getElementById(element).className;
                if (cls.includes(style.checked))
                    document
                        .getElementById(element)
                        .classList.remove(style.checked);
            }
        }
    };
    render() {
        return (
            <div>
                <div className="d-flex flex-row">
                    <div className="p-2">评分</div>
                    <div className="p-2 align-self-center">
                        <i
                            class="fa fa-star"
                            id="one"
                            onClick={this.showCurrent}
                        ></i>
                        <i
                            class="fa fa-star"
                            id="two"
                            onClick={this.showCurrent}
                        ></i>
                        <i
                            class="fa fa-star"
                            id="three"
                            onClick={this.showCurrent}
                        ></i>
                        <i
                            class="fa fa-star"
                            id="four"
                            onClick={this.showCurrent}
                        ></i>
                        <i
                            class="fa fa-star"
                            id="five"
                            onClick={this.showCurrent}
                        ></i>
                    </div>
                </div>
                <InputGroup is="textarea" prepend="我来说两句" />
                <Button className="mt-3">提交</Button>
            </div>
        );
    }
}
