const axios = require("axios");

let lastIndexMovement = 0;

const TELEGRAM_BOTID = "";
const TELEGRAM_CHATID = ";

class Telegram {
    sendTelegramMessage(message) {
        const botId = TELEGRAM_BOTID;
        const chatId = TELEGRAM_CHATID;

        if (!botId || !chatId) {
            return;
        }

        try {
            const telegramMsg = encodeURIComponent(message);
            const url = `https://api.telegram.org/${botId}/sendMessage?chat_id=${chatId}&text=${telegramMsg}&parse_mode=HTML`;
            axios.get(url);
        } catch (e) {
            console.log(e);
        }
    }
}

const telegram = new Telegram();

const getMovimientosGalicia = async () => {
    const url =
        "https://cuentas.bancogalicia.com.ar/Cuentas/GetMovimientosCuenta";

    const cookies =
        "";

    const headers = {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9,es;q=0.8",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie: cookies,
        Referer: "https://cuentas.bancogalicia.com.ar/cuentas/mis-cuentas",
        "Referrer-Policy": "strict-origin-when-cross-origin",
    };

    const body = "";

    const result = await axios.post(url, body, { headers });

    return result.data.Model.Movimientos;
};

const init = async () => {
    let movementsGalicia = await getMovimientosGalicia();

    movementsGalicia = movementsGalicia.reverse();

    movementsGalicia.forEach((movement) => {
        if (movement.IndiceMovimiento > lastIndexMovement) {
            lastIndexMovement = movement.IndiceMovimiento;

            if (movement.ImporteCredito !== "0,00") {
                telegram.sendTelegramMessage(
                    `<strong>🏦 Banco</strong>: Galicia\n<strong>❗️ Nuevo movimiento:</strong> ${movement.DescripcionAMostrar}\n<strong>💰 Ingreso:</strong> ${movement.ImporteCreditoLabel}`
                );
            } else {
                telegram.sendTelegramMessage(
                    `<strong>🏦 Banco</strong>: Galicia\n<strong>❗️ Nuevo movimiento:</strong> ${movement.DescripcionAMostrar}\n<strong>💰 Gasto:</strong> ${movement.ImporteDebitoLabel}`
                );
            }
        }
    });
};

setInterval(init, 10000);
