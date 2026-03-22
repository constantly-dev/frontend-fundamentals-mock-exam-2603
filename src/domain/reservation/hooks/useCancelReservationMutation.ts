import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationKeys } from 'domain/reservation/constants/queryKeys';
import { cancelReservation } from 'pages/remotes';

export function useCancelReservationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
      queryClient.invalidateQueries({ queryKey: reservationKeys.myReservations });
    },
  });
}
