const { chromium } = require('playwright');

const getSberRate = async () => {
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto('https://prisbank.com/#exchange-rates', { waitUntil: 'domcontentloaded' });

        await page.waitForSelector('.Rates_ratesTable__LpRNL', { timeout: 60000 });

        const rates = await page.evaluate(() => {
            const rows = document.querySelectorAll('.Rates_ratesTable__LpRNL tr');
            const currencies = [];

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length > 2) {
                    const ticker = cells[0]?.innerText.trim();
                    const buy = cells[1]?.innerText.trim();
                    const sell = cells[2]?.innerText.trim();

                    if (ticker) {
                        currencies.push({
                            ticker: ticker.slice(0, 3), // Берем только первые 3 символа
                            buy: parseFloat(buy),
                            sell: parseFloat(sell),
                        });
                    }
                }
            });

            return currencies;
        });

        await browser.close();
        return rates;
    } catch (error) {
        console.error('Ошибка при получении данных Sber:', error);
        return [];
    }
};

module.exports = { getSberRate };