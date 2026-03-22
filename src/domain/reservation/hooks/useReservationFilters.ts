import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReservationFilters } from 'domain/reservation/types';

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function useReservationFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [date, setDate] = useState(searchParams.get('date') || formatDate(new Date()));
  const [startTime, setStartTime] = useState(searchParams.get('startTime') || '');
  const [endTime, setEndTime] = useState(searchParams.get('endTime') || '');
  const [attendees, setAttendees] = useState(Number(searchParams.get('attendees')) || 1);
  const [equipment, setEquipment] = useState<string[]>(
    searchParams.get('equipment') ? searchParams.get('equipment')!.split(',').filter(Boolean) : []
  );
  const [preferredFloor, setPreferredFloor] = useState<number | null>(
    searchParams.get('floor') ? Number(searchParams.get('floor')) : null
  );

  useEffect(() => {
    const params: Record<string, string> = {};
    if (date) params.date = date;
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;
    if (attendees > 1) params.attendees = String(attendees);
    if (equipment.length > 0) params.equipment = equipment.join(',');
    if (preferredFloor !== null) params.floor = String(preferredFloor);
    setSearchParams(params, { replace: true });
  }, [attendees, date, endTime, equipment, preferredFloor, setSearchParams, startTime]);

  const filters = useMemo<ReservationFilters>(
    () => ({
      date,
      startTime,
      endTime,
      attendees,
      equipment,
      preferredFloor,
    }),
    [attendees, date, endTime, equipment, preferredFloor, startTime]
  );

  const validationError = useMemo(() => {
    const hasTimeInputs = startTime !== '' && endTime !== '';

    if (!hasTimeInputs) {
      return null;
    }

    if (endTime <= startTime) {
      return '종료 시간은 시작 시간보다 늦어야 합니다.';
    }

    if (attendees < 1) {
      return '참석 인원은 1명 이상이어야 합니다.';
    }

    return null;
  }, [attendees, endTime, startTime]);

  const isFilterComplete = startTime !== '' && endTime !== '' && validationError === null;

  return {
    filters,
    validationError,
    isFilterComplete,
    setDate,
    setStartTime,
    setEndTime,
    setAttendees: (value: number) => setAttendees(Math.max(1, value)),
    setPreferredFloor,
    toggleEquipment: (item: string) =>
      setEquipment(current => (current.includes(item) ? current.filter(value => value !== item) : [...current, item])),
  };
}
