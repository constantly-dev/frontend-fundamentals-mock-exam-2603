import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Border, Button } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import MessageBanner from 'components/MessageBanner';
import AvailableRoomList from 'domain/reservation/components/AvailableRoomList';
import BookingFilters from 'domain/reservation/components/BookingFilters';
import { useAvailableRooms } from 'domain/reservation/hooks/useAvailableRooms';
import { useCreateReservationMutation } from 'domain/reservation/hooks/useCreateReservationMutation';
import { useReservationFilters } from 'domain/reservation/hooks/useReservationFilters';
import { useFloorOptions } from 'domain/reservation/hooks/useFloorOptions';
import axios from 'axios';

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function RoomBookingPage() {
  const navigate = useNavigate();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    filters,
    validationError,
    isFilterComplete,
    setDate,
    setStartTime,
    setEndTime,
    setAttendees,
    setPreferredFloor,
    toggleEquipment,
  } = useReservationFilters();
  const { floors } = useFloorOptions();
  const { mutateAsync: createMutationAsync, isPending: isCreating } = useCreateReservationMutation();
  const { availableRooms } = useAvailableRooms(filters);

  const handleBook = async () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!filters.startTime || !filters.endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      const result = await createMutationAsync({
        roomId: selectedRoomId,
        date: filters.date,
        start: filters.startTime,
        end: filters.endTime,
        attendees: filters.attendees,
        equipment: filters.equipment,
      });

      if ('ok' in result && result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      const errResult = result as { message?: string };
      setErrorMessage(errResult.message ?? '예약에 실패했습니다.');
      setSelectedRoomId(null);
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      setErrorMessage(serverMessage);
      setSelectedRoomId(null);
    }
  };

  useEffect(() => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  }, [filters]);

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <div
        css={css`
          padding: 12px 24px 0;
        `}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="뒤로가기"
          css={css`
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            font-size: 14px;
            color: ${colors.grey600};
            &:hover {
              color: ${colors.grey900};
            }
          `}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        예약하기
      </Top.Top03>

      <Spacing size={12} />
      {errorMessage && <MessageBanner type="error" text={errorMessage} />}

      <Spacing size={24} />

      <BookingFilters
        filters={filters}
        floors={floors}
        minDate={formatDate(new Date())}
        validationError={validationError}
        onDateChange={setDate}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
        onAttendeesChange={setAttendees}
        onPreferredFloorChange={setPreferredFloor}
        onToggleEquipment={toggleEquipment}
      />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 가능 회의실 목록 */}
      {isFilterComplete && (
        <>
          <AvailableRoomList rooms={availableRooms} selectedRoomId={selectedRoomId} onSelectRoom={setSelectedRoomId} />
          <div
            css={css`
              padding: 0 24px;
            `}
          >
            <Spacing size={16} />
            <Button display="full" onClick={handleBook} disabled={isCreating}>
              {isCreating ? '예약 중...' : '확정'}
            </Button>
          </div>
        </>
      )}

      <Spacing size={24} />
    </div>
  );
}
