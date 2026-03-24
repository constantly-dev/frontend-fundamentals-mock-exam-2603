import { useQuery } from '@tanstack/react-query';
import { reservationKeys } from 'domain/reservation/constants/queryKeys';
import { getRooms } from 'pages/remotes';

export function useRoomsQuery() {
  return useQuery({
    queryKey: reservationKeys.rooms,
    queryFn: getRooms,
  });
}
