/**
 * Horoscope API service
 * Uses Aztro API for daily horoscopes
 */

export type ZodiacSign =
    | 'aries'
    | 'taurus'
    | 'gemini'
    | 'cancer'
    | 'leo'
    | 'virgo'
    | 'libra'
    | 'scorpio'
    | 'sagittarius'
    | 'capricorn'
    | 'aquarius'
    | 'pisces';

export interface HoroscopeData {
    date_range: string;
    current_date: string;
    description: string;
    compatibility: string;
    mood: string;
    color: string;
    lucky_number: string;
    lucky_time: string;
}

export const ZODIAC_SIGNS: { sign: ZodiacSign; label: string; emoji: string; dates: string }[] = [
    { sign: 'aries', label: 'Aries', emoji: '♈', dates: 'Mar 21 - Apr 19' },
    { sign: 'taurus', label: 'Taurus', emoji: '♉', dates: 'Apr 20 - May 20' },
    { sign: 'gemini', label: 'Gemini', emoji: '♊', dates: 'May 21 - Jun 20' },
    { sign: 'cancer', label: 'Cancer', emoji: '♋', dates: 'Jun 21 - Jul 22' },
    { sign: 'leo', label: 'Leo', emoji: '♌', dates: 'Jul 23 - Aug 22' },
    { sign: 'virgo', label: 'Virgo', emoji: '♍', dates: 'Aug 23 - Sep 22' },
    { sign: 'libra', label: 'Libra', emoji: '♎', dates: 'Sep 23 - Oct 22' },
    { sign: 'scorpio', label: 'Scorpio', emoji: '♏', dates: 'Oct 23 - Nov 21' },
    { sign: 'sagittarius', label: 'Sagittarius', emoji: '♐', dates: 'Nov 22 - Dec 21' },
    { sign: 'capricorn', label: 'Capricorn', emoji: '♑', dates: 'Dec 22 - Jan 19' },
    { sign: 'aquarius', label: 'Aquarius', emoji: '♒', dates: 'Jan 20 - Feb 18' },
    { sign: 'pisces', label: 'Pisces', emoji: '♓', dates: 'Feb 19 - Mar 20' },
];

/**
 * Generate a daily horoscope based on zodiac sign and date
 * Uses a deterministic algorithm to generate consistent daily horoscopes
 */
function generateDailyHoroscope(sign: ZodiacSign, date: Date): HoroscopeData {
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    const seed = dayOfYear + sign.length;

    const horoscopes = [
        "Today brings new opportunities for growth and self-discovery. Trust your instincts and embrace change.",
        "Your creativity is at its peak today. Use this energy to tackle challenges with innovative solutions.",
        "Focus on building meaningful connections. A conversation today could lead to exciting possibilities.",
        "Take time for self-reflection. Understanding your emotions will guide you toward better decisions.",
        "Your hard work is about to pay off. Stay focused and maintain your positive momentum.",
        "Adventure calls to you today. Step out of your comfort zone and explore new horizons.",
        "Balance is key today. Find harmony between your personal and professional life.",
        "Your intuition is especially strong. Listen to your inner voice when making important choices.",
        "Communication is highlighted today. Express yourself clearly and listen to others with an open mind.",
        "A surprise opportunity may present itself. Be ready to seize the moment when it arrives.",
    ];

    const moods = ["Energetic", "Reflective", "Optimistic", "Focused", "Creative", "Peaceful", "Adventurous", "Confident"];
    const colors = ["Blue", "Green", "Purple", "Red", "Yellow", "Orange", "Pink", "Silver"];
    const compatibilities = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const times = ["Morning", "Afternoon", "Evening", "Night"];

    const horoscopeIndex = seed % horoscopes.length;
    const moodIndex = (seed * 2) % moods.length;
    const colorIndex = (seed * 3) % colors.length;
    const compatIndex = (seed * 5) % compatibilities.length;
    const timeIndex = (seed * 7) % times.length;
    const luckyNumber = ((seed * 11) % 99) + 1;

    const zodiacInfo = getZodiacInfo(sign);

    return {
        date_range: zodiacInfo?.dates || '',
        current_date: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        description: horoscopes[horoscopeIndex],
        compatibility: compatibilities[compatIndex],
        mood: moods[moodIndex],
        color: colors[colorIndex],
        lucky_number: luckyNumber.toString(),
        lucky_time: times[timeIndex],
    };
}

/**
 * Fetch daily horoscope (uses generated horoscopes as fallback)
 */
export async function fetchHoroscope(sign: ZodiacSign): Promise<HoroscopeData> {
    try {
        // Try Aztro API first
        const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        return data as HoroscopeData;
    } catch (error) {
        console.warn('Aztro API unavailable, using generated horoscope:', error);
        // Fallback to generated horoscope
        return generateDailyHoroscope(sign, new Date());
    }
}

/**
 * Get zodiac sign info by sign name
 */
export function getZodiacInfo(sign: ZodiacSign) {
    return ZODIAC_SIGNS.find(z => z.sign === sign);
}

/**
 * Determine zodiac sign from birth date
 */
export function getZodiacSignFromDate(month: number, day: number): ZodiacSign {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
    return 'pisces';
}
