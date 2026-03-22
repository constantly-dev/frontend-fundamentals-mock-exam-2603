import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';
import { formatDateToYmd } from 'utils/formatDateToYmd';

interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  date: string;
  setDate: (date: string) => void;
}

const DatePicker = ({ date, setDate, ...props }: DatePickerProps) => {
  return (
    <div css={containerStyle}>
      <input
        type="date"
        value={date}
        min={formatDateToYmd(new Date())}
        onChange={e => setDate(e.target.value)}
        aria-label="날짜"
        {...props}
        css={innerStyle}
      />
    </div>
  );
};

const containerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const innerStyle = css`
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  height: 48px;
  background-color: ${colors.grey50};
  border-radius: 12px;
  color: ${colors.grey800};
  width: 100%;
  border: 1px solid ${colors.grey200};
  padding: 0 16px;
  outline: none;
  transition: border-color 0.15s;
  &:focus {
    border-color: ${colors.blue500};
  }
`;
export default DatePicker;
