const axios = require('axios');
const cheerio = require('cheerio');

const getAgroRates = async () => {
    try {
        // Загружаем страницу
        const { data: html } = await axios.get('https://www.agroprombank.com/');

        // Парсим HTML с помощью Cheerio
        const $ = cheerio.load(html);

        const rates = [];

        // Находим элементы с курсами
        $('.exchange-rates-item tr').each((_, row) => {
            const ticker = $(row).find('td[data-name1]').attr('data-name1');
            const dataName2 = $(row).find('td[data-name2]').attr('data-name2');
            const buy = $(row).find('td[data-buy]').attr('data-buy');
            const sell = $(row).find('td[data-sell]').attr('data-sell');

            if (
                ticker &&
                dataName2 === 'RUP' &&
                ['USD', 'EUR', 'RUB', 'MDL', 'UAH'].includes(ticker)
            ) {
                rates.push({
                    ticker: ticker.slice(0, 3), // Берем только первые 3 символа
                    buy: parseFloat(buy),
                    sell: parseFloat(sell),
                });
            }
        });

        return rates.slice(0, 5); // Возвращаем только первые 5 записей
    } catch (error) {
        console.error('Ошибка при получении данных Agro:', error);
        return [];
    }
};

module.exports = { getAgroRates };