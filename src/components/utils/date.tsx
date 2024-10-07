import { differenceInDays, format, parseISO } from 'date-fns';

// Formater la date au format DD/MM/YYYY
export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'dd/MM/yyyy');
};

// Calculer le nombre de jours entre deux dates
export const calculateDaysBetween = (start: string, end: string): number => {
  const startParsed = parseISO(start);
  const endParsed = parseISO(end);
  return differenceInDays(endParsed, startParsed);
};

// Calculer le nombre de jours entre la date de fin et la date du jour
export const calculateDaysFromEndToToday = (end: string): number => {
  const endParsed = parseISO(end);
  const today = new Date();
  return differenceInDays(today, endParsed);
};

interface DateUtilsProps {
  startDate: string;
  endDate: string;
}

const DateUtils: React.FC<DateUtilsProps> = ({ startDate, endDate }) => {
  return (
    <ul>
      <li>Date de début : {formatDate(startDate)}</li>
      <li>Date de fin : {formatDate(endDate)}</li>
      <li>Nombre de jours entre la date de début et la date de fin : {calculateDaysBetween(startDate, endDate)}</li>
      <li>Nombre de jours depuis la date de fin : {calculateDaysFromEndToToday(endDate)}</li>
    </ul>
  );
};

export default DateUtils;
