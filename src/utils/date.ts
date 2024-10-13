// @/utils/date.ts

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

// Transformer une date pour que l'heure soit fixée à minuit (00:00:00)
export const resetTimeToMidnight = (dateString: string): string => {
  const date = new Date(dateString);
  date.setUTCHours(0, 0, 0, 0); // Fixer l'heure à 00:00:00 en UTC
  return date.toISOString().replace('.000Z', 'Z'); // Retourner la date avec le format ISO sans millisecondes
};

// Exemple d'utilisation pour regrouper les résultats
export const dateUtils = (startDate: string, endDate: string) => {
  try {
    const startFormatted = formatDate(startDate);
    const endFormatted = formatDate(endDate);
    const daysBetween = calculateDaysBetween(startDate, endDate);
    const daysFromEndToToday = calculateDaysFromEndToToday(endDate);
    const startAtMidnight = resetTimeToMidnight(startDate);
    const endAtMidnight = resetTimeToMidnight(endDate);

    return {
      startFormatted,
      endFormatted,
      daysBetween,
      daysFromEndToToday,
      startAtMidnight,
      endAtMidnight,
    };
  } catch (error) {
    throw new Error(`Erreur lors de la manipulation des dates: ${error.message}`);
  }
};