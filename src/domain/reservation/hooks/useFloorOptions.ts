import { useMemo } from 'react';
import { useRoomsQuery } from 'domain/reservation/hooks/useRoomsQuery';
import { getFloorOptions } from 'domain/reservation/utils/getFloorOptions';

export function useFloorOptions() {
  const { data: rooms = [] } = useRoomsQuery();

  const floors = useMemo(() => getFloorOptions(rooms), [rooms]);

  return { floors };
}
