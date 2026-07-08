export interface ZonedDateTime {
  year: number;
  month: number;
  day: number;
  dayOfWeek: number;
  hour: number;
  minute: number;
  second: number;
  timeString: string;
}

/**
 * Returns the year, month, day, day of week, hour, minute, second and formatted string 
 * of a given date converted to a specific timezone.
 */
export function getZonedDateTime(timeZone: string, date = new Date()): ZonedDateTime {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const findPart = (type: string) => {
      const p = parts.find(x => x.type === type);
      return p ? parseInt(p.value, 10) : 0;
    };

    const year = findPart("year");
    const month = findPart("month");
    const day = findPart("day");
    const hour = findPart("hour") % 24;
    const minute = findPart("minute");
    const second = findPart("second");

    const weekdayShort = date.toLocaleString("en-US", { timeZone, weekday: "short" });
    const weekdayMap: Record<string, number> = {
      Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6
    };
    const dayOfWeek = weekdayMap[weekdayShort] ?? date.getDay();

    const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;

    return { year, month, day, dayOfWeek, hour, minute, second, timeString };
  } catch (e) {
    console.error(`Failed to construct timezone formatter for ${timeZone}:`, e);
    // Safe standard local fallback
    const dayOfWeek = date.getDay();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      dayOfWeek,
      hour,
      minute,
      second,
      timeString,
    };
  }
}

export type MarketType = 'US' | 'EU';

/**
 * Returns the underlying market for a given stock symbol.
 * MC (LVMH) and OR.PA (L'Oréal) belong to Euronext Paris (EU).
 * All other stocks are traded on US markets (US).
 */
export function getStockMarket(symbol: string): MarketType {
  return (symbol.endsWith(".PA") || symbol === "MC") ? 'EU' : 'US';
}

/**
 * Checks if a specific market is open.
 * - US Market: Monday to Friday, 09:30 - 16:00 ET
 * - EU Market: Monday to Friday, 09:00 - 17:30 CET
 * - Continuous Mode: 24/7 Sandbox trading
 */
export function isMarketOpenForType(market: MarketType, mode: 'real' | 'continuous' | 'exact', date = new Date()): boolean {
  if (mode === 'continuous') return true;

  if (market === 'EU') {
    const { dayOfWeek, hour, minute } = getZonedDateTime("Europe/Paris", date);
    if (dayOfWeek === 0 || dayOfWeek === 6) return false; // Closed Saturday and Sunday
    const totalMinutes = hour * 60 + minute;
    // Euronext Paris: 09:00 AM - 05:30 PM
    return totalMinutes >= 9 * 60 && totalMinutes < (17 * 60 + 30);
  } else {
    const { dayOfWeek, hour, minute } = getZonedDateTime("America/New_York", date);
    if (dayOfWeek === 0 || dayOfWeek === 6) return false; // Closed Saturday and Sunday
    const totalMinutes = hour * 60 + minute;
    // US Markets (NYSE/NASDAQ): 09:30 AM - 04:00 PM
    return totalMinutes >= (9 * 60 + 30) && totalMinutes < 16 * 60;
  }
}

/**
 * Checks if the market of a given stock is open.
 */
export function isMarketOpenForStock(symbol: string, mode: 'real' | 'continuous' | 'exact', date = new Date()): boolean {
  return isMarketOpenForType(getStockMarket(symbol), mode, date);
}
