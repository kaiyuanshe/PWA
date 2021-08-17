import { Button } from 'boot-cell/source/Form/Button';
import { Card } from 'boot-cell/source/Content/Card';
import { observer } from 'mobx-web-cell';
import {
    createCell,
    component,
    mixin,
    WebCellProps,
    watch,
    attribute
} from 'web-cell';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { NavLink } from 'boot-cell/source/Navigator/Nav';

import { session, program } from '../../model';
import { Program } from '../../model/Program';

import style from './index.module.less';

const formatTime = (time = +new Date()) => {
    const date = new Date(time + 8 * 60 * 60 * 1000);
    return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '.');
};

const formatActivityTime = (startTime: string, endTime: string) => {
    return `${formatTime(+new Date(startTime))} / ${formatTime(
        +new Date(endTime)
    )}`;
};
interface IUserPage extends WebCellProps {
    uid: string;
}
@observer
@component({
    tagName: 'user-page',
    renderTarget: 'children'
})
export default class UserPage extends mixin<IUserPage>() {
    @attribute
    @watch
    uid: string;

    connectedCallback() {
        program.getMentors(this.uid);

        super.connectedCallback();
    }

    render() {
        const avatarUrl: string =
            session?.user?.avatar?.url ||
            'https://kaiyuanshe.cn/image/KaiYuanShe-logo.png';

        return (
            <div className={style.user_container}>
                <Card className={style.user_card}>
                    <img
                        src={avatarUrl}
                        alt="用户头像"
                        className={style.avatar}
                    />
                    <h3>{session.user.username}</h3>
                    <div>{session.user.summary}</div>
                    <div className={style.btn_container}>
                        <Button color="primary" href="profile">
                            编辑用户资料
                        </Button>
                    </div>
                </Card>
                <div className={style.activity_container}>
                    <TabView mode="masthead">
                        <NavLink>报名列表</NavLink>
                        <TabPanel className={style.activity_panel}>
                            {program.activityInfoList.map((item: Program) => {
                                return (
                                    <Card
                                        className={style.activity_item}
                                        title={item.title}
                                    >
                                        <div>
                                            时间：
                                            {formatActivityTime(
                                                item.start_time,
                                                item.end_time
                                            )}
                                        </div>
                                        <div>地址：{item.place}</div>
                                        <div>简介：{item.summary}</div>
                                    </Card>
                                );
                            })}
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        );
    }
}
