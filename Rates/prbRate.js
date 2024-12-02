const axios = require('axios');
const cheerio = require('cheerio');

const getPrbRates = async () => {
    const desiredTickers = [
        'USD', 'EUR', 'RUB', 'MDL', 'UAH',
        'GBP', 'PLN', 'CHF', 'BGN', 'RON',
        'AED', 'CNY', 'JPY', 'TRY', 'BYN'
    ];

    try {
        // Загружаем HTML страницы
        const { data: html } = await axios.get('https://www.cbpmr.net/kursval.php?lang=ru');

        // Парсим HTML
        const $ = cheerio.load(html);

        const rates = [];
        // Ищем строки с курсами
        $('.simple-little-table tbody tr').each((_, row) => {
            const cells = $(row).find('td');
            if (cells.length > 5) {
                const ticker = $(cells[3]).text().trim();
                const buy = $(cells[5]).text().trim();
                const sell = $(cells[5]).text().trim(); // Оба значения берутся из одного столбца

                if (ticker && desiredTickers.includes(ticker)) {
                    rates.push({
                        ticker: ticker.slice(0, 3), // Первые 3 символа тикера
                        buy: parseFloat(buy),
                        sell: parseFloat(sell),
                    });
                }
            }
        });

        return rates;
    } catch (error) {
        console.error('Ошибка при получении данных PRB:', error);
        return [];
    }
};

module.exports = { getPrbRates };