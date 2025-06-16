import { WebCellProps } from 'web-cell';
import { formatDate, TimeData } from 'web-utility';

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
            <time dateTime={startDate}>{startDate}</time>{' '}
            <time dateTime={startTime}>{startTime}</time> ~{' '}
            {end && (
                <>
                    {startDate !== endDate ? (
                        <>
                            <time dateTime={endDate}>{endDate}</time>{' '}
                        </>
                    ) : null}
                    <time dateTime={endTime}>{endTime}</time>
                </>
            )}
        </div>
    );
}
