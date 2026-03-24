import { Room } from 'domain/reservation/types';

export function getFloorOptions(rooms: Room[]): number[] {
  return [...new Set(rooms.map(room => room.floor))].sort((a, b) => a - b);
}
