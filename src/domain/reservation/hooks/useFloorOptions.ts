import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Room } from 'domain/reservation/types';
import { getRooms } from 'pages/remotes';

export function useFloorOptions() {
  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms,
  });

  const floors = useMemo(() => [...new Set(rooms.map((room: Room) => room.floor))].sort((a, b) => a - b), [rooms]);

  return {
    floors,
  };
}
