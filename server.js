const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const { getSberRate } = require("./Rates/sberRate");
const { getAgroRates } = require("./Rates/agroRate");
const { getPrbRates } = require("./Rates/prbRate");


app.use(cors({
  origin: "https://jocular-kheer-9ba604.netlify.app"
}));

const logAllRates = async () => {
    try {
        console.log("Получение курсов Агропромбанка...");
        const agroRates = await getAgroRates();
        console.log("AgroRates:", agroRates);

        console.log("\nПолучение курсов Приднестровского банка...");
        const prbRates = await getPrbRates();
        console.log("PrbRates:", prbRates);

        console.log("\nПолучение курсов Сбербанка...");
        const sberRates = await getSberRate();
        console.log("SberRates:", sberRates);
    } catch (error) {
        console.error("Ошибка при получении курсов:", error);
    }
};

let lastRates = null; // Для кэширования курсов
let lastUpdated = null; // Метка времени последнего обновления

const normalizeRates = (rates) => {
    return rates.map((rate) => {
      const [ticker] = rate.ticker.includes("/") ? rate.ticker.split("/") : [rate.ticker];
      return { ticker, buy: rate.buy, sell: rate.sell };
    });
  };
  
  app.get("/", async (req, res) => {
    try {
      console.log("Запрос на / начат");
      const [agroRates, prbRates, sberRates] = await Promise.all([
        getAgroRates(),
        getPrbRates(),
        getSberRate(),
      ]);
      console.log("Данные получены:", { agroRates, prbRates, sberRates });
  
      lastRates = {
        agro: normalizeRates(agroRates),
        prb: normalizeRates(prbRates),
        sber: normalizeRates(sberRates),
      };
      lastUpdated = Date.now();
  
      console.log("Отправляем данные клиенту:", lastRates);
      res.json({ ...lastRates, lastUpdated });
    } catch (error) {
      console.error("Ошибка при обработке запроса:", error);
      res.status(500).json({ error: "Ошибка при получении данных" });
    }
  });

logAllRates();


app.listen(port, () => {
    console.log(`Сервер запущен: http://localhost:${port}`);
});