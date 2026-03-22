export const EQUIPMENT_LABELS: Record<string, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
};

export const ALL_EQUIPMENT = ['tv', 'whiteboard', 'video', 'speaker'];

export const TIMELINE_START = 9;
export const TIMELINE_END = 20;
export const TOTAL_MINUTES = (TIMELINE_END - TIMELINE_START) * 60;

export const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = TIMELINE_START; h <= TIMELINE_END; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < TIMELINE_END) {
      slots.push(`${String(h).padStart(2, '0')}:30`);
    }
  }
  return slots;
})();

export const HOUR_LABELS = TIME_SLOTS.filter(t => t.endsWith(':00'));
