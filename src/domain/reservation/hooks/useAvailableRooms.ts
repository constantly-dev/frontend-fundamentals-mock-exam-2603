import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { ReservationFilters, Reservation, Room } from 'domain/reservation/types';
import { getReservations, getRooms } from 'pages/remotes';

export function useAvailableRooms(filters: ReservationFilters) {
  const { date, startTime, endTime, attendees, equipment, preferredFloor } = filters;
  const [roomsQuery, reservationsQuery] = useQueries({
    queries: [
      {
        queryKey: ['rooms'],
        queryFn: getRooms,
      },
      {
        queryKey: ['reservations', date],
        queryFn: () => getReservations(date),
        enabled: Boolean(date),
      },
    ],
  });

  const rooms = roomsQuery.data ?? [];
  const reservations = reservationsQuery.data ?? [];

  const availableRooms = useMemo(
    () =>
      rooms
        .filter((room: Room) => {
          if (room.capacity < attendees) return false;
          if (!equipment.every(item => room.equipment.includes(item))) return false;
          if (preferredFloor !== null && room.floor !== preferredFloor) return false;

          return !reservations.some(
            (reservation: Reservation) =>
              reservation.roomId === room.id &&
              reservation.date === date &&
              reservation.start < endTime &&
              reservation.end > startTime
          );
        })
        .sort((a: Room, b: Room) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return a.name.localeCompare(b.name);
        }),
    [attendees, date, endTime, equipment, preferredFloor, reservations, rooms, startTime]
  );

  return {
    availableRooms,
  };
}
