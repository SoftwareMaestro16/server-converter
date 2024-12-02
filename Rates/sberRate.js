const axios = require('axios');
const { parse } = require('node-html-parser');

const getSberRate = async () => {
    try {
        // Используем Rendertron API для рендеринга
        const { data: html } = await axios.get(
            'https://render-tron.appspot.com/render/https://prisbank.com/#exchange-rates'
        );

        // Парсим динамически сгенерированный HTML
        const root = parse(html);

        const rates = [];
        const rows = root.querySelectorAll('.Rates_ratesTable__LpRNL tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 2) {
                const ticker = cells[0]?.textContent.trim().slice(0, 3);
                const buy = parseFloat(cells[1]?.textContent.trim());
                const sell = parseFloat(cells[2]?.textContent.trim());
                if (ticker) {
                    rates.push({ ticker, buy, sell });
                }
            }
        });

        return rates;
    } catch (error) {
        console.error('Ошибка при получении данных Sber:', error);
        return [];
    }
};

module.exports = { getSberRate };