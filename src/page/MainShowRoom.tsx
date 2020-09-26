import { component, mixin, createCell } from 'web-cell';
import { ButtonGroup } from 'boot-cell/source/Form/ButtonGroup';
import { Button } from 'boot-cell/source/Form/Button';

@component({
    tagName: 'main-playroom'
})
export class MainShowRoom extends mixin() {
    render() {
        return (
            <div>
                <div
                    style={{
                        background: '#3a0b61',
                        color: 'white',
                        textAlign: 'center',
                        opacity: '0.9'
                    }}
                >
                    <h2>DevOpsDays Online Forum</h2>
                    <h4>[2020 DevOpsDays 在线峰会]</h4>
                    <iframe
                        src="//player.bilibili.com/player.html?aid=754280090&bvid=BV1Dk4y117oW&cid=226560058&page=1"
                        scrolling="no"
                        border="0"
                        frameborder="no"
                        framespacing="0"
                        allowfullscreen="true"
                        width="440"
                        height="220"
                    >
                        {' '}
                    </iframe>
                    <div
                        style={{
                            background: '#D298DB',
                            margin: 'auto',
                            width: '450px',
                            height: '23px',
                            borderRadius: '20px'
                        }}
                    >
                        <ButtonGroup>
                            {[
                                '直播日程表',
                                '云端展厅',
                                '大会讲师',
                                '官方社群'
                            ].map(text => (
                                <Button
                                    style={{
                                        background: 'white',
                                        color: '#a324f2',
                                        fontFamily:
                                            'Arial, Helvetica, sans-serif',
                                        fontSize: '0.8em',
                                        fontWeight: 'bold',
                                        borderRadius: '20px',
                                        marginLeft: '5',
                                        marginRight: '5'
                                    }}
                                    color="secondary"
                                >
                                    {text}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>
                </div>

                <br style={{ lineHeight: '10px' }}></br>

                <div
                    style={{
                        background: '#3a0b61',
                        color: 'white',
                        textAlign: 'center',
                        opacity: '0.9',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ float: 'left', marginLeft: '5px' }}>
                        <svg
                            style={{ float: 'left', paddingTop: '10px' }}
                            width="2em"
                            height="2em"
                            viewBox="0 0 16 16"
                            class="bi bi-arrow-left-circle"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                            />
                            <path
                                fill-rule="evenodd"
                                d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"
                            />
                        </svg>
                        <p
                            style={{
                                display: 'inline',
                                float: 'left',
                                marginTop: '13',
                                marginLeft: '5',
                                marginBottom: '0'
                            }}
                        >
                            回 到 首 页
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
