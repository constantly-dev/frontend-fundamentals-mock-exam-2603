import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationKeys } from 'domain/reservation/constants/queryKeys';
import { createReservation } from 'pages/remotes';

interface CreateReservationData {
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
}

export function useCreateReservationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReservationData) => createReservation(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.list(variables.date) });
      queryClient.invalidateQueries({ queryKey: reservationKeys.myReservations });
    },
  });
}
