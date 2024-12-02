const { chromium } = require('playwright');

const getPrbRates = async () => {
    const desiredTickers = [
        'USD', 'EUR', 'RUB', 'MDL', 'UAH',
        'GBP', 'PLN', 'CHF', 'BGN', 'RON',
        'AED', 'CNY', 'JPY', 'TRY', 'BYN'
    ];

    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto('https://www.cbpmr.net/kursval.php?lang=ru', { waitUntil: 'domcontentloaded' });

        await page.waitForSelector('.simple-little-table', { timeout: 60000 });

        const rates = await page.evaluate((desiredTickers) => {
            const rows = document.querySelectorAll('.simple-little-table tbody tr');
            const currencies = [];

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length > 5) {
                    const ticker = cells[3]?.innerText.trim();
                    const buy = cells[5]?.innerText.trim();
                    const sell = cells[5]?.innerText.trim();

                    if (ticker && desiredTickers.includes(ticker)) {
                        currencies.push({
                            ticker: ticker.slice(0, 3), // Берем только первые 3 символа
                            buy: parseFloat(buy),
                            sell: parseFloat(sell),
                        });
                    }
                }
            });

            return currencies;
        }, desiredTickers);

        await browser.close();
        return rates;
    } catch (error) {
        console.error('Ошибка при получении данных PRB:', error);
        return [];
    }
};

module.exports = { getPrbRates };