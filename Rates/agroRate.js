const puppeteer = require('puppeteer');

const getAgroRates = async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto('https://www.agroprombank.com/', { waitUntil: 'networkidle0' });
        await page.waitForSelector('.exchange-rates-item', { timeout: 60000 });

        const rates = await page.evaluate(() => {
            const rows = document.querySelectorAll('.exchange-rates-item tr');
            const currencies = [];

            rows.forEach(row => {
                const ticker = row.querySelector('td[data-name1]')?.getAttribute('data-name1');
                const dataName2 = row.querySelector('td[data-name2]')?.getAttribute('data-name2');
                const buy = row.querySelector('td[data-buy]')?.getAttribute('data-buy');
                const sell = row.querySelector('td[data-sell]')?.getAttribute('data-sell');

                if (
                    ticker &&
                    dataName2 === 'RUP' &&
                    ['USD', 'EUR', 'RUB', 'MDL', 'UAH'].includes(ticker)
                ) {
                    currencies.push({
                        ticker: ticker.slice(0, 3), // Берем только первые 3 символа
                        buy: parseFloat(buy),
                        sell: parseFloat(sell),
                    });
                }
            });

            return currencies.slice(0, 5); // Возвращаем только первые 5 записей
        });

        await browser.close();
        return rates;
    } catch (error) {
        console.error('Ошибка при получении данных Agro:', error);
        return [];
    }
};

module.exports = { getAgroRates };