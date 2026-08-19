export interface PrayerTimeItem {
  key: string;
  name: string;
  nameMalay: string;
  time: string;
  isNext?: boolean;
}

/**
 * Calculates standard prayer times for Malaysia / SE Asia based on latitude & longitude.
 * Includes a robust astronomical calculation algorithm with JAKIM convention parameters.
 */
export function calculatePrayerTimes(
  lat: number | null | undefined,
  lng: number | null | undefined,
  date: Date = new Date()
): {
  items: PrayerTimeItem[];
  currentOrNextPrayer: string;
  dateFormatted: string;
} {
  // Default to Kuala Lumpur coordinates if not provided
  const targetLat = lat ?? 3.139;
  const targetLng = lng ?? 101.6869;

  // Day of year and solar calculation
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Fractional year in radians
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1);

  // Equation of time in minutes
  const eqtime = 229.18 * (
    0.000075 +
    0.001868 * Math.cos(gamma) -
    0.032077 * Math.sin(gamma) -
    0.014615 * Math.cos(2 * gamma) -
    0.040849 * Math.sin(2 * gamma)
  );

  // Solar declination in radians
  const decl = 0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma);

  // Timezone offset for Malaysia (UTC+8)
  const timezone = 8;
  const noonMinutes = 720 - (4 * targetLng) - eqtime + (timezone * 60);

  const rad = (deg: number) => (deg * Math.PI) / 180;
  const deg = (radVal: number) => (radVal * 180) / Math.PI;

  const getHourAngle = (angle: number, isSunrise: boolean = false): number | null => {
    const latRad = rad(targetLat);
    const cosHA = (Math.sin(rad(-angle)) - Math.sin(latRad) * Math.sin(decl)) /
                  (Math.cos(latRad) * Math.cos(decl));
    if (cosHA > 1 || cosHA < -1) return null;
    const ha = deg(Math.acos(cosHA));
    return isSunrise ? -ha : ha;
  };

  // JAKIM standard angles: Fajr 18°, Isha 18°
  const fajrHA = getHourAngle(18, true) ?? -108;
  const maghribHA = getHourAngle(0.833, false) ?? 90;
  const ishaHA = getHourAngle(18, false) ?? 108;

  // Asr (Shafi'i shadow factor = 1)
  const latRad = rad(targetLat);
  const asrAngle = deg(Math.atan(1 + Math.tan(Math.abs(latRad - decl))));
  const asrCosHA = (Math.sin(rad(90 - asrAngle)) - Math.sin(latRad) * Math.sin(decl)) /
                   (Math.cos(latRad) * Math.cos(decl));
  const asrHA = Math.abs(deg(Math.acos(Math.max(-1, Math.min(1, asrCosHA)))));

  const minutesToTimeStr = (totalMinutes: number): string => {
    const normMin = (totalMinutes + 1440) % 1440;
    const hours24 = Math.floor(normMin / 60);
    const mins = Math.floor(normMin % 60);
    const minsStr = mins.toString().padStart(2, '0');
    // 12-hour format
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minsStr}`;
  };

  const toMinutesSinceMidnight = (totalMinutes: number): number => {
    return (totalMinutes + 1440) % 1440;
  };

  const fajrMin = noonMinutes + (fajrHA * 4);
  const dhuhrMin = noonMinutes + 3; // 3 min safety margin
  const asrMin = noonMinutes + (asrHA * 4);
  const maghribMin = noonMinutes + (maghribHA * 4) + 2; // 2 min margin
  const isyakMin = noonMinutes + (ishaHA * 4);

  const rawPrayers = [
    { key: 'fajr', name: 'Fajr', nameMalay: 'Subuh', min: fajrMin },
    { key: 'dhuhr', name: 'Dhuhr', nameMalay: 'Zohor', min: dhuhrMin },
    { key: 'asr', name: 'Asr', nameMalay: 'Asar', min: asrMin },
    { key: 'maghrib', name: 'Maghrib', nameMalay: 'Maghrib', min: maghribMin },
    { key: 'isyak', name: 'Isyak', nameMalay: 'Isyak', min: isyakMin },
  ];

  // Determine current/next prayer based on current time
  const currentMinutesNow = (date.getHours() * 60) + date.getMinutes();
  let nextPrayerKey = 'fajr';

  if (currentMinutesNow < toMinutesSinceMidnight(fajrMin)) {
    nextPrayerKey = 'fajr';
  } else if (currentMinutesNow < toMinutesSinceMidnight(dhuhrMin)) {
    nextPrayerKey = 'dhuhr';
  } else if (currentMinutesNow < toMinutesSinceMidnight(asrMin)) {
    nextPrayerKey = 'asr';
  } else if (currentMinutesNow < toMinutesSinceMidnight(maghribMin)) {
    nextPrayerKey = 'maghrib';
  } else if (currentMinutesNow < toMinutesSinceMidnight(isyakMin)) {
    nextPrayerKey = 'isyak';
  } else {
    nextPrayerKey = 'fajr';
  }

  const items: PrayerTimeItem[] = rawPrayers.map((p) => ({
    key: p.key,
    name: p.name,
    nameMalay: p.nameMalay,
    time: minutesToTimeStr(p.min),
    isNext: p.key === nextPrayerKey,
  }));

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const dateFormatted = date.toLocaleDateString('en-MY', options);

  return {
    items,
    currentOrNextPrayer: nextPrayerKey,
    dateFormatted,
  };
}
