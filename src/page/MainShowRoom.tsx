import { component, mixin, createCell, watch, attribute } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { ButtonGroup } from 'boot-cell/source/Form/ButtonGroup';
import { Button } from 'boot-cell/source/Form/Button';

import style from './MainShowRoom.module.less';
import { Partner } from '../component/Partner';
import { partnership } from '../model';

const buttons = ['直播日程表', '云端展厅', '大会讲师', '官方社群'];

@observer
@component({
    tagName: 'main-playroom',
    renderTarget: 'children'
})
export class MainShowRoom extends mixin() {
    @attribute
    @watch
    id = '';

    connectedCallback() {
        this.id = '1';
        partnership.getAllOfOneActivity(this.id);
        super.connectedCallback();
    }

    render() {
        const { name, slogan } = partnership.all[0].activity;
        const partners = partnership.all.map(p => <Partner partnership={p} />);

        return (
            <div className={style.ground}>
                <div style={{ maxWidth: '1090', margin: 'auto' }}>
                    <h2>{name}</h2>
                    <h4 style={{ marginTop: '20', marginBottom: '20' }}>
                        {slogan}
                    </h4>
                    <iframe
                        src="//player.bilibili.com/player.html?aid=754280090&bvid=BV1Dk4y117oW&cid=226560058&page=1"
                        scrolling="no"
                        border="0"
                        frameborder="no"
                        framespacing="0"
                        allowfullscreen="true"
                        width="660"
                        height="330"
                    />
                    <div className={style.buttonsTray}>
                        <ButtonGroup>
                            {buttons.map(text => (
                                <Button
                                    className={style.buttons}
                                    color="secondary"
                                >
                                    {text}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>

                    <div style={{ overflow: 'auto' }}>
                        <div className={style.logos}>{partners}</div>
                    </div>
                </div>
            </div>
        );
    }
}
