import { WebCellProps, createCell, Fragment } from 'web-cell';
import { TimeData, formatDate } from 'web-utility/source/date';

export interface TimeRangeProps extends WebCellProps {
    start: TimeData;
    end?: TimeData;
}

export function TimeRange({
    start,
    end,
    defaultSlot,
    ...rest
}: TimeRangeProps) {
    const startDate = formatDate(start, 'YYYY-MM-DD'),
        startTime = formatDate(start, 'HH:mm'),
        endDate = end && formatDate(end, 'YYYY-MM-DD'),
        endTime = end && formatDate(end, 'HH:mm');

    return (
        <div {...rest}>
            <time datetime={startDate}>{startDate}</time>{' '}
            <time datetime={startTime}>{startTime}</time> ~{' '}
            {end && (
                <>
                    {startDate !== endDate ? (
                        <>
                            <time datetime={endDate}>{endDate}</time>{' '}
                        </>
                    ) : null}
                    <time datetime={endTime}>{endTime}</time>
                </>
            )}
        </div>
    );
}
