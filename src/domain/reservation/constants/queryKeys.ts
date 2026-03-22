export const reservationKeys = {
  all: ['reservations'] as const,
  list: (date: string) => [...reservationKeys.all, date] as const,
  myReservations: ['myReservations'] as const,
  rooms: ['rooms'] as const,
};
