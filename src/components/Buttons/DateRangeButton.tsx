import { StateRects } from '@popperjs/core';
import { ReactElement, memo } from 'react';
import { FormControl } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { styled } from 'styled-components';

import { SGroup, SLabel } from '@helpers/styledComponents.ts';

interface DateRangeButtonProps {
  startDate?: Date;
  setStartDate: (value: Date) => void;
  labelStart: string | ReactElement;
  endDate?: Date;
  setEndDate: (value: Date) => void;
  labelEnd: string | ReactElement;
}

const SDatePickerGroup = styled(SGroup)`
  .react-datepicker-wrapper {
    width: 100%;
  }
`;

const popperModifiers = [
  {
    name: 'arrow',
    options: {
      padding: ({ popper, reference }: StateRects) => ({
        right: Math.min(popper.width, reference.width) - 24,
      }),
    },
  },
];

const DateRangeButton = ({
  startDate,
  setStartDate,
  labelStart,
  endDate,
  setEndDate,
  labelEnd,
}: DateRangeButtonProps) => {
  const minTime = new Date();
  minTime.setMilliseconds(0);
  minTime.setSeconds(0);
  minTime.setMinutes(0);
  minTime.setHours(0);

  const maxTime = new Date();
  maxTime.setMilliseconds(0);
  maxTime.setSeconds(0);
  maxTime.setMinutes(59);
  maxTime.setHours(23);

  const setMinStartTime = (date: Date) => {
    const selectedDay = date.getDate();
    const currentDay = new Date().getDate();

    if (currentDay === selectedDay) {
      return new Date();
    }

    return minTime;
  };

  const setMaxStartTime = (date?: Date) => {
    const currentDay = new Date().getDate();

    if (date && currentDay === date.getDate()) {
      return date || new Date();
    }

    return maxTime;
  };

  const setMinEndTime = (date: Date) => {
    const selectedDay = date.getDate();
    const currentDay = new Date().getDate();

    if (currentDay === selectedDay) {
      return startDate || new Date();
    }

    return minTime;
  };

  return (
    <>
      <SDatePickerGroup>
        <SLabel>{labelStart}</SLabel>
        {/* TODO DatePicker doesn't like "moduleResolution": "nodenext", created issue https://github.com/Hacker0x01/react-datepicker/issues/4039 */}
        {/* @ts-ignore */}
        <DatePicker
          customInput={<FormControl type='text' />}
          placeholderText='Set start date'
          showTimeSelect
          selectsStart
          dateFormat='MMMM d, yyyy HH:mm'
          popperModifiers={popperModifiers}
          selected={startDate}
          onChange={(date: Date) => setStartDate(date)}
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          timeFormat='HH:mm'
          minTime={setMinStartTime(startDate || new Date())}
          maxTime={setMaxStartTime(endDate)}
        />
      </SDatePickerGroup>

      <SDatePickerGroup>
        <SLabel>{labelEnd}</SLabel>
        {/* @ts-ignore */}
        <DatePicker
          customInput={<FormControl type='text' />}
          placeholderText='Set end date'
          showTimeSelect
          selectsEnd
          dateFormat='MMMM d, yyyy HH:mm'
          popperModifiers={popperModifiers}
          selected={endDate}
          onChange={(date: Date) => setEndDate(date)}
          startDate={startDate}
          endDate={endDate}
          minDate={startDate || new Date()}
          timeFormat='HH:mm'
          minTime={setMinEndTime(endDate || new Date())}
          maxTime={maxTime}
        />
      </SDatePickerGroup>
    </>
  );
};

export default memo(DateRangeButton);
