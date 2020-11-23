const { GeneticAlgorithm, Trader } = require('./genetic')
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

var NeuroEvolution = function () {
    this.STATE_INIT = 1;
    this.STATE_START = 2;
    this.STATE_PLAY = 3;
    this.STATE_GAMEOVER = 4;
}

NeuroEvolution.prototype = {
    create: function () {

        console.log('create')
        // create a new Genetic Algorithm with a population of 10 units which will be evolving by using 4 top units
        this.GA = new GeneticAlgorithm(10, 4);

        this.traders = []
        for (var i = 0; i < this.GA.max_units; i++) {
            this.traders.push(new Trader(i));
        }

        this.GA.reset();
        this.GA.createPopulation();
    },

    start: function () {
        console.log('start i:', this.GA.iteration,
            'BP:', this.GA.best_population,
            'BF:', this.GA.best_fitness,
            'BS:', this.GA.best_score
        )
        this.score = 0;
        this.distance = 0;

        this.traders.forEach(function (trader) {
            trader.restart(this.GA.iteration);
        }, this);
    },

    update: function (ticker) {
        console.log('update ticker:', ticker)

        this.traders.map(trader => {
            trader.fitness_curr = 0 //?
            trader.score_curr = this.score;

            if (trader.alive()) {
                //this.TargetPoint = sttock price
                this.GA.activateBrain(trader, ticker);
            }
        })

        // console.log('NOW:', this.traders)
    },

    gameOver: function () {
        this.GA.evolvePopulation();
        this.GA.iteration++;
    }
}

const NE = new NeuroEvolution()
console.log(NE)
NE.create()

console.log('handleByTicker')

let raw = fs.readFileSync('ibov_by_ticker.json');

let tickersMap = JSON.parse(raw);

const _tickerHistory = Object.values(tickersMap['VALE3'])
const tickerHistoryArray = _tickerHistory.slice(-200, _tickerHistory.length)

const mappedHistoryArray = tickerHistoryArray.map(ticker => ({
    ...ticker,
    open: parseFloat(ticker.open),
    close: parseFloat(ticker.close),
    high: parseFloat(ticker.high),
    low: parseFloat(ticker.low),
    volume: parseFloat(ticker.volume),
}))

console.log(JSON.stringify(mappedHistoryArray))

// //another for
// NE.start()
// // console.log(tickerHistoryArray)
// mappedHistoryArray.map(ticker => {
//     // console.log(ticker)
//     NE.update(ticker)
// })
// // var j = 0
// // while (j < 5) {
// //     NE.update()
// //     j++;
// // }
// console.log(NE.traders.map(trader => trader.total()))
// // console.log(NE.traders)