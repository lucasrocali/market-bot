const synaptic = require('synaptic');

var GeneticAlgorithm = function (max_units, top_units) {

    console.log('GeneticAlgorithm init')

    this.max_units = max_units; // max number of units in population
    this.top_units = top_units; // number of top units (winners) used for evolving population

    if (this.max_units < this.top_units) this.top_units = this.max_units;

    this.Population = []; // array of all units in current population
}

GeneticAlgorithm.prototype = {
    // resets genetic algorithm parameters
    reset: function () {

        console.log('GA reset')

        this.iteration = 1;	// current iteration number (it is equal to the current population number)
        this.mutateRate = 1; // initial mutation rate

        this.best_population = 0; // the population number of the best unit
        this.best_fitness = 0;  // the fitness of the best unit
        this.best_score = 0;	// the score of the best unit ever
    },
    // creates a new population
    createPopulation: function () {

        console.log('GA createPopulation')

        // clear any existing population
        this.Population.splice(0, this.Population.length);

        for (var i = 0; i < this.max_units; i++) {
            // create a new unit by generating a random Synaptic neural network
            // with 2 neurons in the input layer, 6 neurons in the hidden layer and 1 neuron in the output layer
            var newUnit = new synaptic.Architect.Perceptron(2, 30, 2);

            // set additional parameters for the new unit
            newUnit.index = i;
            newUnit.fitness = 0;
            newUnit.score = 0;
            newUnit.isWinner = false;

            // add the new unit to the population 
            this.Population.push(newUnit);
        }
    },

    // activates the neural network of an unit from the population 
    // to calculate an output action according to the inputs
    activateBrain: function (trader, ticker) {
        // create an array of all inputs
        //1 st test
        var inputs = [ticker.open / ticker.close, ticker.low / ticker.close]; //ticker.price, ticker.open ....

        // calculate outputs by activating synaptic neural network of this bird
        var outputs = this.Population[trader.index].activate(inputs);

        console.log('activateBrain', inputs, outputs)
        // perform flap if output is greater than 0.5
        trader.decide(outputs[0], outputs[1], ticker.close)
    },

    // selects the best units from the current population
    selection: function () {
        // sort the units of the current population	in descending order by their fitness
        var sortedPopulation = this.Population.sort(
            function (unitA, unitB) {
                return unitB.fitness - unitA.fitness;
            }
        );

        // mark the top units as the winners!
        for (var i = 0; i < this.top_units; i++) this.Population[i].isWinner = true;

        // return an array of the top units from the current population
        return sortedPopulation.slice(0, this.top_units);
    },
}

var Trader = function (index, initial_brl = 100000) {
    this.index = index;
    this.balance_brl = initial_brl
    this.ticker_amount = 0
    this.ticker_value = 0
};

Trader.prototype = {
    restart: function (iteration) {
        console.log('Trader restart')
        this.fitness_prev = (iteration == 1) ? 0 : this.fitness_curr;
        this.fitness_curr = 0;

        this.score_prev = (iteration == 1) ? 0 : this.score_curr;
        this.score_curr = 0;

        this.balance_prev = this.balance_brl;
    },
    decide: function (buyOutput, sellOutput, value, amount = 100) {
        if (buyOutput > 0.5 && this.balance_brl - (value * amount) > 0) {
            // console.log('buy', this.index, buyOutput, this.balance_brl, this.ticker_amount)
            this.balance_brl = this.balance_brl - (value * amount)
            this.ticker_amount = this.ticker_amount + amount
        } else if (sellOutput > 0.5 && this.ticker_amount - amount > 0) {
            // console.log('sell', this.index, sellOutput, this.balance_brl, this.ticker_amount)
            this.balance_brl = this.balance_brl + (value * amount)
            this.ticker_amount = this.ticker_amount - amount
        }
        this.ticker_value = value
    },
    total: function () {
        return this.balance_brl + this.ticker_amount * this.ticker_value
    },
    alive: function () {
        // console.log('alive?', this.score_curr > 0.8 * this.inital_balance)
        return true
    }
}

// const GA = new GeneticAlgorithm(10, 4);

module.exports = {
    GeneticAlgorithm,
    Trader
}

// console.log(GA)
// let days = []
// for (var i = 0; i < GA.max_units; i++) {
//     console.log('GA.add', i)
//     days.push(new Trader(i));
// }

// console.log(days)

// GA.reset();
// GA.createPopulation();


// console.log(GA.Population)