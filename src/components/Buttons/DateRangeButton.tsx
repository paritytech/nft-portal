import { StateRects } from '@popperjs/core';
import { memo } from 'react';
import Form from 'react-bootstrap/esm/Form';
import DatePicker from 'react-datepicker';

interface DateRangeButtonProps {
  startDate?: Date;
  setStartDate: (value: Date) => void;
  endDate?: Date;
  setEndDate: (value: Date) => void;
}

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

const DateRangeButton = ({ startDate, setStartDate, endDate, setEndDate }: DateRangeButtonProps) => {
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
      <Form.Group className='mb-3'>
        <Form.Label>
          Mint start <i>(optional)</i>:
        </Form.Label>
        <DatePicker
          customInput={<Form.Control />}
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
      </Form.Group>

      <Form.Group className='mb-3'>
        <Form.Label>
          Mint end <i>(optional)</i>:
        </Form.Label>
        <DatePicker
          customInput={<Form.Control />}
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
      </Form.Group>
    </>
  );
};

export default memo(DateRangeButton);
