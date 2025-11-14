export interface ExchangeRates {
    rates: {
        USD: number;
        THB: number;
        LAK: number;
    };
    lastUpdate: number;
}

async function fetchWithRetry(
    url: string,
    maxRetries = 3
): Promise<Response> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve =>
                setTimeout(resolve, Math.pow(2, i) * 1000)
            );
        }
    }
    throw new Error('Max retries reached');
}

export async function fetchExchangeRates(): Promise<ExchangeRates> {
    try {
        const response = await fetchWithRetry(
            'https://api.exchangerate-api.com/v4/latest/USD'
        );
        const data = await response.json();

        return {
            rates: {
                USD: 1,
                THB: data.rates.THB,
                LAK: data.rates.LAK
            },
            lastUpdate: Date.now()
        };
    } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        throw error;
    }
}
