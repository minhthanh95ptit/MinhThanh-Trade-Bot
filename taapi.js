const https = require('https')

const req = https.request('https://api.taapi.io/rsi?secret=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1pbmh0aGFuaDk1cHRpdEBnbWFpbC5jb20iLCJpYXQiOjE2MzM1Mzc5NjUsImV4cCI6Nzk0MDczNzk2NX0.m3N73hZFhBcQZFKuadmjW_e3jJRmqYMn6h5XBLGTp58&exchange=binance&symbol=BTC/USDT&interval=15m', res => {

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})

req.end()