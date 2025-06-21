import { Button, Card, CardBody, CardFooter, Tab, Tabs } from 'boot-cell';
import { observable } from 'mobx';
import {
    attribute,
    component,
    observer,
    WebCell,
    WebCellProps
} from 'web-cell';
import { formatDate } from 'web-utility';

import { t } from '../../i18n';
import { Program, program, session } from '../../model';
import * as styles from './index.module.less';

const formatActivityTime = (startTime: string, endTime: string) =>
    `${formatDate(startTime)} / ${formatDate(endTime)}`;

interface IUserPage extends WebCellProps {
    uid: string;
}

export default interface UserInfo extends WebCell<IUserPage> {}

@component({ tagName: 'user-info' })
@observer
export default class UserInfo
    extends HTMLElement
    implements WebCell<IUserPage>
{
    @attribute
    @observable
    accessor uid = 0;

    connectedCallback() {
        program.getMentors(this.uid);
    }

    renderProgramCard = ({
        start_time,
        end_time,
        place,
        summary,
        title
    }: Program) => (
        <Card key={title} className={styles.activity_item} title={title}>
            <div>
                {t('time')}
                {formatActivityTime(start_time, end_time)}
            </div>
            <div>
                {t('address')}
                {place.address.building}
            </div>
            <div>
                {t('summary')}
                {summary}
            </div>
        </Card>
    );

    render() {
        const avatarUrl =
            session?.user?.avatar?.url ||
            'https://kaiyuanshe.cn/image/KaiYuanShe-logo.png';

        return (
            <div className={styles.user_container}>
                <Card className={styles.user_card}>
                    <img
                        src={avatarUrl}
                        alt={t('userAvatar')}
                        className={styles.avatar}
                    />
                    <CardBody>
                        <h3>{session.user.username}</h3>
                        <div>{session.user.summary}</div>
                    </CardBody>
                    <CardFooter className={styles.btn_container}>
                        <Button color="primary" href="profile">
                            {t('editProfile')}
                        </Button>
                    </CardFooter>
                </Card>
                <div className={styles.activity_container}>
                    <Tabs mode="masthead">
                        <Tab
                            caption={t('registrationList')}
                            className={styles.activity_panel}
                        >
                            {program.activityInfoList.map(
                                this.renderProgramCard
                            )}
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}
