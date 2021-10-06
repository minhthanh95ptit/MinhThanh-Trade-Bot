const binance = require('node-binance-api')().options({
    APIKEY: process.env.APIKEY,
    APISECRET: process.env.APISECRET,
    useServerTime: true,
    test: true // True = SandboxMode
});

let listClose = [];
let changeUp = 0;
let changeDown = 0;
let last_closeHigh = 0;
let last_closeLow = 0;
let current_time = Date.now();
let period = 6;

function calculateRSI() {
    console.log("Generating RSI");
    binance.candlesticks("BTCUSDT", "1d", (error, ticks, symbol) => {
        for (i = 0; i < ticks.length; i++) {
            let last_tick = ticks[i];
            let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
            listClose.push(close);
            if (i == ticks.length -1 ) {
                for (x = 0; x < ticks.length; x++) {
                    previous_close = (parseFloat(listClose[x-1]));
                    current_close = (parseFloat(listClose[x]));
                    // HIGH
                    if (current_close > previous_close) {
                        upChange = current_close - previous_close;
                        changeUp += upChange;
                        if (x == ticks.length -1) {
                            last_closeHigh = current_close - previous_close;
                        }
                    }
                    // LOW
                    if (previous_close > current_close) {
                        downChange = previous_close - current_close;
                        changeDown += downChange;
                        if (x == ticks.length - 1) {
                            last_closeLow = previous_close - current_close;
                        }
                    }
                    if (x == ticks.length-1) {
                        AVGHigh = changeUp / period;
                        AVGLow = changeDown / period;
                        Upavg = (AVGHigh * (period -1) + last_closeHigh) / (period);
                        Downavg = (AVGLow * (period -1) + last_closeLow) / (period);
                        RS = Upavg / Downavg;
                        RSI = (100 - (100 / (1 + RS)));
                        console.log(RSI);
                        return RSI;
                    }
                }
            }
        }
    }, {
        limit: period,
        endTime: current_time
    });
}
calculateRSI();