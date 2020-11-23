class Trader {
	/**
	 * Takes in a object with properties : id, x, y upper_length, lower_length, upper_width, lower_width,
	 * @constructor
	 */
	constructor(params) {
		this.id = params.id;
        this.lastOperation = 'neutral' //buy, sell
        this.initialBalance = 100000
        this.balanceBRL = this.initialBalance 
        this.balanceTicker = 0
        this.balanceTotal = 0
        this.tradeCount = 0
		this.score = 0;
		this.fitness = 0;
		this.parents = [];
		this.colors = [];
		this.params = params;
		this.brain = new NeuralNetwork(2, 200, 2);

		this.init();
	}
	
	init() {
		let selected_color = color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
		this.colors = [selected_color, selected_color];
	}

	add_to_world(world) {
		// Matter.World.add(world, [this.upper_right_leg, this.upper_left_leg, this.lower_left_leg, this.lower_right_leg]);
		// Matter.World.add(world, [this.left_joint, this.right_joint, this.main_joint]);
		// Matter.World.add(world, [this.main_muscle, this.left_muscle, this.right_muscle]);
	}

	show(i,tvalue) {
        if (this.lastOperation == 'buy') {
            fill('green');
        } else if (this.lastOperation == 'sell') {
            fill('red');
        } else {
            fill('gray');
        }
       
        // rect(60+i*4,500 - tvalue.close  * 10, 4, 12);
        
        // fill('gray');
        rect(60 + i*4,570 + 9 *this.id, 4, 8);
	}

	adjust_score() {
		this.score = this.balanceTotal > this.initialBalance ? this.balanceTotal - this.initialBalance : 0
	}

	think(counter, currentValue, currentMavgValueA,currentMavgValueB) {
        const spread = ((currentValue.close - currentValue.open) / currentValue.open)*100
        const mavgSpreadA = ((currentValue.close - currentMavgValueA) / currentMavgValueA)*100
        const mavgSpreadB = ((currentValue.close - currentMavgValueB) / currentMavgValueB)*100
        const currentPrice = currentValue.close

        // let mayBuy = ''
        // let maySell = ''

        //close acima da media movel, venda, mvgSpread > 0
        //close abaixo da media movel, compra, mvgSpread < 0
        // if (mavgSpreadA > 0 && mavgSpreadB > 0){

        // }

        const canBuy = this.balanceBRL - 100*currentPrice > 0 ? 1 : 0
        const canSell = this.balanceTicker - 100 > 0 ? 1 : 0

        let input = [mavgSpreadA,mavgSpreadB];
     
        let result = this.brain.predict(input);
        const currentDecisionBuy = result[0]
        const currentDecisionSell = result[1]

        // console.log('currentDecision', currentDecision)
        this.id == 0 && console.log('input',
        // spread.toFixed(1),
        mavgSpreadA.toFixed(1),
        mavgSpreadB.toFixed(1),
        '==>',
        currentDecisionBuy.toFixed(1),
        currentDecisionSell.toFixed(1))

        //REMOVE FROM HERE
        const neutralThreshold = 0.8
        const tradeTax = 30
        //
        const buyThreshold =  0.8
        const sellThreshold = 0.8
      
        if (currentDecisionBuy > buyThreshold && canBuy) {
            this.lastOperation = 'buy'
            this.balanceBRL = this.balanceBRL - 100*currentPrice - tradeTax
            this.balanceTicker = this.balanceTicker + 100
            this.tradeCount++

        } else if (currentDecisionSell > sellThreshold && canSell) {
            this.lastOperation = 'sell'
            this.balanceBRL = this.balanceBRL + 100*currentPrice - tradeTax
            this.balanceTicker = this.balanceTicker - 100
            this.tradeCount++

        } else {
            this.lastOperation = 'neutral'
        }

        this.balanceTotal = this.balanceBRL + this.balanceTicker*currentPrice
        // console.log('think', spread, result)
	}

	clone() {
		let params = Object.assign({}, this.params);
		let new_trader = new Trader(params);
		new_trader.brain.dispose();
        new_trader.brain = this.brain.clone();
		return new_trader;
	}

	kill() {
		// Dispose its brain
		this.brain.dispose();
	}

	mutate() {
		function fn(x) {
			if (random(1) < 0.05) {
				let offset = randomGaussian() * 0.5;
				let newx = x + offset;
				return newx;
			}
			return x;
		}

		let ih = this.brain.input_weights.dataSync().map(fn);
		let ih_shape = this.brain.input_weights.shape;
		this.brain.input_weights.dispose();
		this.brain.input_weights = tf.tensor(ih, ih_shape);
		
		let ho = this.brain.output_weights.dataSync().map(fn);
		let ho_shape = this.brain.output_weights.shape;
		this.brain.output_weights.dispose();
		this.brain.output_weights = tf.tensor(ho, ho_shape);
	}

	crossover(partner) {
		let parentA_in_dna = this.brain.input_weights.dataSync();
		let parentA_out_dna = this.brain.output_weights.dataSync();
		let parentB_in_dna = partner.brain.input_weights.dataSync();
		let parentB_out_dna = partner.brain.output_weights.dataSync();

		let mid = Math.floor(Math.random() * parentA_in_dna.length);
		let child_in_dna = [...parentA_in_dna.slice(0, mid), ...parentB_in_dna.slice(mid, parentB_in_dna.length)];		
		let child_out_dna = [...parentA_out_dna.slice(0, mid), ...parentB_out_dna.slice(mid, parentB_out_dna.length)];

		let child = this.clone();
		let input_shape = this.brain.input_weights.shape;
		let output_shape = this.brain.output_weights.shape;
		
		child.brain.dispose();

		child.brain.input_weights = tf.tensor(child_in_dna, input_shape);
		child.brain.output_weights = tf.tensor(child_out_dna, output_shape);
		
		return child;
	}
}