
// const fs = require('fs');
// const path = require('path');
// const csv = require('fast-csv');

// function handleByTicker() {

//     console.log('handleByTicker')

//     let raw = fs.readFileSync('ibov_by_ticker.json');

//     let tickersMap = JSON.parse(raw);

//     console.log(Object.keys(tickersMap['VALE3']))
//     const prices = Object.keys(tickersMap['VALE3']).map(key => tickersMap['VALE3'][key].close)
//     console.log(prices)
// }

// function handleByDay() {

//     console.log('handleByDay')

//     let raw = fs.readFileSync('ibov_by_day.json');

//     let tickersMap = JSON.parse(raw);

//     // console.log(Object.keys(tickersMap))
//     console.log(tickersMap['2018-12-28'])
// }

// console.log('init')

// handleByTicker()
// // handleByDay()

const tf = require('@tensorflow/tfjs');
// // const tf = tensorflow.tfjs
// // import * as tf from '@tensorflow/tfjs';

// // Define a model for linear regression.
// const model = tf.sequential();
// model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

// // Prepare the model for training: Specify the loss and the optimizer.
// model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

// // Generate some synthetic data for training.
// const xs = tf.tensor2d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [10, 1]);
// const ys = tf.tensor2d([3, 6, 9, 12, 15, 18, 21, 24, 27, 30], [10, 1]);

// // Train the model using the data.
// model.fit(xs, ys, { epochs: 1500, shuffle: true }).then(() => {
//     // Use the model to do inference on a data point the model hasn't seen before:
//     model.predict(tf.tensor2d([56], [1, 1])).print();
// });

const NEURONS = 8;

const hiddenLayer = tf.layers.dense({
    units: NEURONS,
    inputShape: [3],
    activation: 'sigmoid',
});

const outputLayer = tf.layers.dense({
    units: 1,
});

const model = tf.sequential();

model.add(hiddenLayer);
model.add(outputLayer);

model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

console.log(model)
