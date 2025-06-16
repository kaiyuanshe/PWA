import { Button } from 'boot-cell/source/Form/Button';
import { Card } from 'boot-cell/source/Content/Card';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { NavLink } from 'boot-cell/source/Navigator/Nav';
import { observer } from 'mobx-web-cell';
import {
    createCell,
    component,
    mixin,
    WebCellProps,
    watch,
    attribute
} from 'web-cell';
import { formatDate } from 'web-utility/source/date';

import { session, program } from '../../model';
import style from './index.module.less';

const formatActivityTime = (startTime: string, endTime: string) => {
    return `${formatDate(startTime)} / ${formatDate(endTime)}`;
};
interface IUserPage extends WebCellProps {
    uid: string;
}
@observer
@component({
    tagName: 'user-info',
    renderTarget: 'children'
})
export default class UserInfo extends mixin<IUserPage>() {
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
                            {program.activityInfoList.map(
                                ({
                                    start_time,
                                    end_time,
                                    place,
                                    summary,
                                    title
                                }) => (
                                    <Card
                                        className={style.activity_item}
                                        title={title}
                                    >
                                        <div>
                                            时间：
                                            {formatActivityTime(
                                                start_time,
                                                end_time
                                            )}
                                        </div>
                                        <div>地址：{place}</div>
                                        <div>简介：{summary}</div>
                                    </Card>
                                )
                            )}
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        );
    }
}
