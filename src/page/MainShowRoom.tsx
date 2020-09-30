import { component, mixin, createCell } from 'web-cell';
import { ButtonGroup } from 'boot-cell/source/Form/ButtonGroup';
import { Button } from 'boot-cell/source/Form/Button';
import { Icon } from 'boot-cell/source/Reminder/Icon';

import style from './MainShowRoom.module.less';
import { Partner } from '../component/Partner';

const buttons = ['直播日程表', '云端展厅', '大会讲师', '官方社群'];

@component({
    tagName: 'main-playroom',
    renderTarget: 'children'
})
export class MainShowRoom extends mixin() {
    render() {
        return (
            <div>
                <div className={style.ground}>
                    <h2>DevOpsDays Online Forum</h2>
                    <h4 style={{ marginTop: '20', marginBottom: '20' }}>
                        [2020 DevOpsDays 在线峰会]
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
                </div>

                <div
                    className={style.ground}
                    style={{
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ float: 'left', marginLeft: '5px' }}>
                        <div style={{ display: 'block', float: 'left' }}>
                            <Icon name="arrow-left-circle" width={32} />
                            <p
                                style={{
                                    display: 'inline',
                                    marginTop: '13',
                                    marginLeft: '5',
                                    marginBottom: '0'
                                }}
                            >
                                回 到 首 页
                            </p>
                        </div>

                        <div className={style.logos}>
                            <Partner id="1" />
                            <Partner id="1" />
                            <Partner id="1" />
                            <Partner id="1" />
                            <Partner id="1" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
