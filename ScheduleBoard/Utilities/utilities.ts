import { CalendarDate } from './dateUtilities';

export function randomColor(): string {
  const randomInt = (min: number, max: number)
  : number => (Math.random() * (max - min + 1) + min) << 0;

  const H = randomInt(0, 360);
  const S = randomInt(45, 65);
  const L = randomInt(45, 65);

  return `hsl(${H}, ${S}%, ${L}%)`;
}

export function checkBookingsExistance(days: Array<Array<CalendarDate>>) : Boolean {
  days.forEach(week => {
    week.forEach(item => {
      if (item.bookings.length > 0) {
        return true;
      }
    });
  });

  return false;
}
