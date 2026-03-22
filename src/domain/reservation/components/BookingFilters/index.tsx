import { css } from '@emotion/react';
import { Spacing, Text, Select } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import DatePicker from 'components/DatePicker';
import { ALL_EQUIPMENT, EQUIPMENT_LABELS, TIME_SLOTS } from 'domain/reservation/constants';
import { ReservationFilters } from 'domain/reservation/types';

interface BookingFiltersProps {
  filters: ReservationFilters;
  floors: number[];
  minDate: string;
  validationError: string | null;
  onDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onAttendeesChange: (value: number) => void;
  onPreferredFloorChange: (value: number | null) => void;
  onToggleEquipment: (value: string) => void;
}

const inputStyle = css`
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

const fieldStyle = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const BookingFilters = ({
  filters,
  floors,
  minDate,
  validationError,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onAttendeesChange,
  onPreferredFloorChange,
  onToggleEquipment,
}: BookingFiltersProps) => {
  return (
    <>
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 조건
        </Text>
        <Spacing size={16} />

        <div css={fieldStyle}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            날짜
          </Text>
          <DatePicker date={filters.date} min={minDate} setDate={onDateChange} aria-label="날짜" />
        </div>
        <Spacing size={14} />

        <div
          css={css`
            display: flex;
            gap: 12px;
          `}
        >
          <div
            css={css`
              ${fieldStyle};
              flex: 1;
            `}
          >
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
              시작 시간
            </Text>
            <Select value={filters.startTime} onChange={e => onStartTimeChange(e.target.value)} aria-label="시작 시간">
              <option value="">선택</option>
              {TIME_SLOTS.slice(0, -1).map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Select>
          </div>
          <div
            css={css`
              ${fieldStyle};
              flex: 1;
            `}
          >
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
              종료 시간
            </Text>
            <Select value={filters.endTime} onChange={e => onEndTimeChange(e.target.value)} aria-label="종료 시간">
              <option value="">선택</option>
              {TIME_SLOTS.slice(1).map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <Spacing size={14} />

        <div
          css={css`
            display: flex;
            gap: 12px;
          `}
        >
          <div
            css={css`
              ${fieldStyle};
              flex: 1;
            `}
          >
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
              참석 인원
            </Text>
            <input
              type="number"
              min={1}
              value={filters.attendees}
              onChange={e => onAttendeesChange(Number(e.target.value))}
              aria-label="참석 인원"
              css={inputStyle}
            />
          </div>
          <div
            css={css`
              ${fieldStyle};
              flex: 1;
            `}
          >
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
              선호 층
            </Text>
            <Select
              value={filters.preferredFloor ?? ''}
              onChange={e => onPreferredFloorChange(e.target.value === '' ? null : Number(e.target.value))}
              aria-label="선호 층"
            >
              <option value="">전체</option>
              {floors.map(floor => (
                <option key={floor} value={floor}>
                  {floor}층
                </option>
              ))}
            </Select>
          </div>
        </div>
        <Spacing size={14} />

        <div>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            필요 장비
          </Text>
          <Spacing size={8} />
          <div
            css={css`
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
            `}
          >
            {ALL_EQUIPMENT.map(item => {
              const selected = filters.equipment.includes(item);

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onToggleEquipment(item)}
                  aria-label={EQUIPMENT_LABELS[item]}
                  aria-pressed={selected}
                  css={css`
                    padding: 8px 16px;
                    border-radius: 20px;
                    border: 1px solid ${selected ? colors.blue500 : colors.grey200};
                    background: ${selected ? colors.blue50 : colors.grey50};
                    color: ${selected ? colors.blue600 : colors.grey700};
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.15s;
                    &:hover {
                      border-color: ${selected ? colors.blue500 : colors.grey400};
                    }
                  `}
                >
                  {EQUIPMENT_LABELS[item]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {validationError && (
        <div
          css={css`
            padding: 0 24px;
          `}
        >
          <Spacing size={8} />
          <span
            css={css`
              color: ${colors.red500};
              font-size: 14px;
            `}
            role="alert"
          >
            {validationError}
          </span>
        </div>
      )}
    </>
  );
};

export default BookingFilters;
