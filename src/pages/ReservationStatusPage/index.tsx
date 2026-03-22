import { css } from '@emotion/react';
import { Suspense, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Top, Spacing, Border, Button, Text, Banner } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import DatePicker from 'components/DatePicker';
import MyReservationList from 'domain/reservation/components/MyReservationList';
import ReservationTimeline from 'domain/reservation/components/ReservationTimeline';
import { toast, Toaster } from 'react-hot-toast';
import { formatDateToYmd } from 'utils/formatDateToYmd';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { message?: string } | null;

  const [date, setDate] = useState(formatDateToYmd(new Date()));

  useEffect(() => {
    if (locationState?.message) {
      toast.success(locationState.message, {
        position: 'bottom-center',
        duration: 3000,
      });
      window.history.replaceState({}, '');
    }
  }, [locationState]);

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        회의실 예약
      </Top.Top03>

      <Spacing size={24} />

      {/* 날짜 선택 */}
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          날짜 선택
        </Text>
        <Spacing size={16} />
        <DatePicker date={date} setDate={setDate} />
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 현황 타임라인 */}
      <Suspense fallback={<div>로딩중...</div>}>
        <ReservationTimeline date={date} />
      </Suspense>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 내 예약 목록 */}
      <Suspense fallback={<div>로딩중...</div>}>
        <MyReservationList />
      </Suspense>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약하기 버튼 */}
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}
