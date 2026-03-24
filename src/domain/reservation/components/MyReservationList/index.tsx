import { css } from '@emotion/react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { Button, ListRow, Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { EQUIPMENT_LABELS } from 'domain/reservation/constants';
import { reservationKeys } from 'domain/reservation/constants/queryKeys';
import { useCancelReservationMutation } from 'domain/reservation/hooks/useCancelReservationMutation';
import { getMyReservations, getRooms } from 'pages/remotes';
import { useState } from 'react';

interface Reservation {
  id: string;
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
}

const MyReservationList = () => {
  const [{ data: myReservationsData }, { data: roomsData }] = useSuspenseQueries({
    queries: [
      { queryKey: reservationKeys.myReservations, queryFn: getMyReservations },
      { queryKey: reservationKeys.rooms, queryFn: getRooms },
    ],
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { mutateAsync: cancelMutationAsync, isPending: isCanceling } = useCancelReservationMutation();

  const handleCancel = async (id: string) => {
    try {
      await cancelMutationAsync(id);
      setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
    } catch {
      setMessage({ type: 'error', text: '취소에 실패했습니다.' });
    }
  };

  const findRoomName = (roomId: string) => roomsData.find(r => r.id === roomId)?.name ?? roomId;

  return (
    <div>
      {/* 메시지 배너 */}
      {message && (
        <div
          css={css`
            padding: 0 24px;
          `}
        >
          <div
            css={css`
              padding: 10px 14px;
              border-radius: 10px;
              background: ${message.type === 'success' ? colors.blue50 : colors.red50};
              display: flex;
              align-items: center;
              gap: 8px;
            `}
          >
            <Text
              typography="t7"
              fontWeight="medium"
              color={message.type === 'success' ? colors.blue600 : colors.red500}
            >
              {message.text}
            </Text>
          </div>
          <Spacing size={12} />
        </div>
      )}

      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: baseline;
            gap: 6px;
          `}
        >
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            내 예약
          </Text>
          {myReservationsData.length > 0 && (
            <Text typography="t7" fontWeight="medium" color={colors.grey500}>
              {myReservationsData.length}건
            </Text>
          )}
        </div>
        <Spacing size={16} />

        {myReservationsData.length === 0 ? (
          <div
            css={css`
              padding: 40px 0;
              text-align: center;
              background: ${colors.grey50};
              border-radius: 14px;
            `}
          >
            <Text typography="t6" color={colors.grey500}>
              예약 내역이 없습니다.
            </Text>
          </div>
        ) : (
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 10px;
            `}
          >
            {myReservationsData.map((res: Reservation) => (
              <div
                key={res.id}
                css={css`
                  padding: 14px 16px;
                  border-radius: 14px;
                  background: ${colors.grey50};
                  border: 1px solid ${colors.grey200};
                `}
              >
                <ListRow
                  contents={
                    <ListRow.Text2Rows
                      top={findRoomName(res.roomId)}
                      topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                      bottom={`${res.date} ${res.start}~${res.end} · ${res.attendees}명 · ${
                        res.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'
                      }`}
                      bottomProps={{ typography: 't7', color: colors.grey600 }}
                    />
                  }
                  right={
                    <Button
                      type="danger"
                      style="weak"
                      size="small"
                      onClick={e => {
                        e.stopPropagation();
                        if (window.confirm('정말 취소하시겠습니까?')) {
                          handleCancel(res.id);
                        }
                      }}
                      disabled={isCanceling}
                    >
                      취소
                    </Button>
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservationList;
