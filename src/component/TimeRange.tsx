import { WebCellProps } from 'web-cell';
import { formatDate, TimeData } from 'web-utility';

export interface TimeRangeProps extends WebCellProps {
    start: TimeData;
    end?: TimeData;
}

export function TimeRange({
    className = '',
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
        <div className={`d-flex gap-2 ${className}`} {...rest}>
            <time dateTime={startDate}>{startDate}</time>{' '}
            <time dateTime={startTime}>{startTime}</time> ~{' '}
            {end && (
                <>
                    {startDate !== endDate && (
                        <time dateTime={endDate}>{endDate}</time>
                    )}
                    <time dateTime={endTime}>{endTime}</time>
                </>
            )}
        </div>
    );
}
