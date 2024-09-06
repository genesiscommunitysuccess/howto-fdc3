import Numeral from 'numeral';
import 'numeral/locales';

const defaultDateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'UTC',
};

export function getNumberFormatter(format: string, locale?: string) {
  return (params) => {
    // bigdecimals are sent as strings
    if (!(params && (typeof params.value === 'number' || typeof params.value === 'string'))) {
      return '';
    }

    if (locale) {
      Numeral.locale(locale);
    }

    return Numeral(params.value).format(format);
  };
}

export function getDateFormatter(
  locale: string = 'en-GB',
  options: Intl.DateTimeFormatOptions = defaultDateOptions,
) {
  return (params) => {
    if (!(params && typeof params.value === 'number')) return '';

    return new Intl.DateTimeFormat(locale, options).format(params.value);
  };
}

export const formatNumber = (minDP = 2, maxDP = minDP) => {
  return (params) => {
    if (!(params && typeof params.value === 'number')) return '';
    const lang = (navigator && navigator.language) || 'en-GB';
    return Intl.NumberFormat(lang, {
      minimumFractionDigits: minDP,
      maximumFractionDigits: maxDP,
    }).format(params.value);
  };
}

export const formatDateLong = (param: number): string => {
  if (!(param && typeof param === 'number' && param > 0)) return '';
  const date = new Date(param);

  const formattedDate = new Intl.DateTimeFormat(Intl.DateTimeFormat().resolvedOptions().locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
  return formattedDate;
};

export const formatDateTime = (params) => {
  if (params == null || !params) {
    return '';
  }

  const value = new Date(params);

  // Extract date components
  const year = value.getFullYear();
  const month = (value.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = value.getDate().toString().padStart(2, '0');

  // Extract time components
  const hours = value.getHours().toString().padStart(2, '0');
  const minutes = value.getMinutes().toString().padStart(2, '0');
  const seconds = value.getSeconds().toString().padStart(2, '0');

  // Construct the formatted datetime string
  const formattedDateTime = `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
};
