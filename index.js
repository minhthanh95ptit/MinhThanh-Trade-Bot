const ccxt = require('ccxt')
const moment = require('moment');
const delay = require('delay');
const plotAsset = require('./chart')
const fs = require('fs')

const binance = new ccxt.binance({
    apiKey: process.env.APIKEY,
    secret: process.env.APISECRET
});

binance.setSandboxMode(true)

async function printBlance(lastPrice){
    const balance = await binance.fetchBalance()
    const total = balance.total
    // console.log(total)
    // console.log(`Balance: BTC ${total.BTC}, USDT: ${total.BUSDT}`);
    data = `Total USDT ${(total.BTC - 1) * lastPrice + total.USDT}.\n`
    await fs.writeFileSync('./trade_log.txt', data, {flag:'a+'})
}

async function tick(){
    const prices = await binance.fetchOHLCV('BNB/USDT', '15m', undefined, 10)
    const bPrices = prices.map(price =>{
        return {
            timestamp: moment(price[0]).format(),
            open: price[1],
            close: price[4],
        }
    })

    console.log(bPrices);

    const averagePrice = bPrices.reduce((acc, price) => acc + price.close, 0) / 5

    const lastPrice = bPrices[bPrices.length - 1].close
    


    const direction = lastPrice > averagePrice ? 'sell' : 'buy'

    const TRADE_SIZE = 100
    const quantity = 100 / lastPrice
    // console.log(`Average price: ${averagePrice}, Last price: ${lastPrice}`)
    await binance.createMarketOrder('BTC/USDT', direction, quantity)
    // const data = `${moment().format()}: ${direction}${quantity} BTC at ${lastPrice}\n`
    // await fs.writeFileSync('./trade_log.txt', data, {flag:'a+'})
    printBlance(lastPrice)
    plotAsset()
}

async function main(){
   while(true){
       await tick()
       await delay(1000 * 60)
   } 
   
}   

main()

