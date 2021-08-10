import { Button } from 'boot-cell/source/Form/Button';
import { TooltipBox } from 'boot-cell/source/Prompt/Tooltip';
import { observer } from 'mobx-web-cell';
import { createCell, component, mixin } from 'web-cell';
import { Table, TableRow } from 'boot-cell/source/Content/Table';

import { activity, program } from '../../model';
import { Program } from '../../model/Program';

import style from './index.module.less';

let lastId = '';
@observer
@component({
    tagName: 'user-page',
    renderTarget: 'children'
})
export default class UserPage extends mixin() {
    state = { id: '' };

    updatedCallback() {
        if (lastId !== this.state.id) {
            program.getMentors(this.state.id);
            lastId = this.state.id;
        }
    }

    render() {
        const {
            current: { id }
        } = activity;

        if (id !== this.state.id) {
            lastId = id;
            this.setState({ id });
        }
        return (
            <div className={`${style.user_container}`}>
                {/* <div className={`${style.user_container_left}`}>
                    <img
                        alt="WebCell scaffold"
                        src="https://kaiyuanshe.cn/image/KaiYuanShe-logo.png"
                        className={`${style.user_container_avatar}`}
                    />
                    <TooltipBox text="lichunyinggggggggggg" position={'top'}>
                        lichunying
                    </TooltipBox>
                </div> */}
                <h1>活动列表</h1>
                <div className={`${style.table_container}`}>
                    <Table border>
                        <TableRow type="head">
                            <th scope="col">#</th>
                            <th scope="col">标题</th>
                            <th scope="col">活动地址</th>
                            <th scope="col">开始时间</th>
                            <th scope="col">结束时间</th>
                            <th scope="col">更新时间</th>
                            <th scope="col">活动简介</th>
                        </TableRow>
                        {program?.activityInfoList?.map(
                            (item: Program, index: number) => {
                                const {
                                    title,
                                    summary,
                                    end_time,
                                    start_time,
                                    place,
                                    updated_at
                                } = item;
                                return (
                                    <TableRow>
                                        <th scope="row">{index + 1}</th>
                                        <TooltipBox
                                            text={title}
                                            position={'bottom'}
                                        >
                                            <td className={style.table_td}>
                                                {title}
                                            </td>
                                        </TooltipBox>

                                        <td>{place}</td>
                                        <td>{start_time}</td>
                                        <td>{end_time}</td>
                                        <td>{updated_at}</td>

                                        <TooltipBox
                                            text={summary}
                                            position={'bottom'}
                                        >
                                            <td className={style.table_td}>
                                                {summary}
                                            </td>
                                        </TooltipBox>
                                    </TableRow>
                                );
                            }
                        )}
                    </Table>
                </div>
            </div>
        );
    }
}
