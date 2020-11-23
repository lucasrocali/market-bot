
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

function mapByTicker() {

    console.log('mapByTicker')

    let tickersMap = {}

    fs.createReadStream('ibov.csv')
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', row => {
            if (!tickersMap[row.ticker]) {
                tickersMap[row.ticker] = {}
            }
            tickersMap[row.ticker][row.datetime] = row
        })
        .on('end', rowCount => fs.writeFileSync('ibov_by_ticker.json', JSON.stringify(tickersMap)));

}

function mapByDay() {

    console.log('mapByDay')

    let tickersMap = {}

    fs.createReadStream('ibov.csv')
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', row => {
            if (!tickersMap[row.datetime]) {
                tickersMap[row.datetime] = {}
            }
            tickersMap[row.datetime][row.ticker] = row
        })
        .on('end', rowCount => fs.writeFileSync('ibov_by_day.json', JSON.stringify(tickersMap)));

}


console.log('init')
// mapByTicker()
mapByDay()