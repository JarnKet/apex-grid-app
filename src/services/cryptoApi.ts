// Crypto and Gold price API service

export interface CryptoPrice {
    symbol: string;
    name: string;
    price: number;
    change24h: number;
}

/**
 * Fetch cryptocurrency and gold prices
 * Uses CoinGecko API (free tier, no API key required)
 */
export async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,gold&vs_currencies=usd&include_24hr_change=true',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch crypto prices: ${response.status}`);
        }

        const data = await response.json();

        const prices: CryptoPrice[] = [];

        if (data.bitcoin) {
            prices.push({
                symbol: 'BTC',
                name: 'Bitcoin',
                price: data.bitcoin.usd,
                change24h: data.bitcoin.usd_24h_change || 0,
            });
        }

        if (data.ethereum) {
            prices.push({
                symbol: 'ETH',
                name: 'Ethereum',
                price: data.ethereum.usd,
                change24h: data.ethereum.usd_24h_change || 0,
            });
        }

        if (data.gold) {
            prices.push({
                symbol: 'XAU',
                name: 'Gold',
                price: data.gold.usd,
                change24h: data.gold.usd_24h_change || 0,
            });
        }

        return prices;
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
        throw error;
    }
}

/**
 * Format price with appropriate decimal places
 */
export function formatPrice(price: number): string {
    if (price >= 1000) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    } else if (price >= 1) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    } else {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
        }).format(price);
    }
}

/**
 * Format percentage change
 */
export function formatChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
}
