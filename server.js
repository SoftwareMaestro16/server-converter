const express = require("express");
const cors = require("cors");
const { getSberRate } = require("./Rates/sberRate");
const { getAgroRates } = require("./Rates/agroRate");
const { getPrbRates } = require("./Rates/prbRate");

const app = express();
const port = 3000;

app.use(cors({
  origin: "https://192.168.1.145:5175/"
}));

const normalizeRates = (rates) => {
  return rates.map((rate) => {
    const [ticker] = rate.ticker.includes("/") ? rate.ticker.split("/") : [rate.ticker];
    return { ticker, buy: rate.buy, sell: rate.sell };
  });
};

app.get("/", async (req, res) => {
  try {
    console.log("started");

    const [agroRates, prbRates, sberRates] = await Promise.all([
      getAgroRates(),
      getPrbRates(),
      // getSberRate(),
    ]);

    const lastRates = {
      agro: normalizeRates(agroRates),
      prb: normalizeRates(prbRates),
      // sber: normalizeRates(sberRates),
    };

    console.log("Все курсы:", lastRates);

    const lastUpdated = Date.now();
    res.json({ ...lastRates, lastUpdated });
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
    res.status(500).json({ error: "Ошибка при получении данных" });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен: http://localhost:${port}`);
});
