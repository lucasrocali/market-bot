class SimpleBoundary {

    /**
     * @constructor
     */
    constructor() {
        this.ground = Matter.Bodies.rectangle(width / 2, height - 15, width, 50, {
            isStatic: true,
            friction: 1,
            collisionFilter: {
                category: 0x0001
            }
        });

        this.roof = Matter.Bodies.rectangle(width / 2, 10, width, 20, {
            isStatic: true,
            friction: 1,
            collisionFilter: {
                category: 0x0001
            }
        });

        this.left_wall = Matter.Bodies.rectangle(10, height / 2, 20, height, {
            isStatic: true,
            friction: 1,
            collisionFilter: {
                category: 0x0001
            }
        });

        this.right_wall = Matter.Bodies.rectangle(width - 10, height / 2, 20, height, {
            isStatic: true,
            friction: 1,
            collisionFilter: {
                category: 0x0001
            }
        });
    }

    /**
     * Adds the current boundary to MatterJS World
     */
    add_to_world() {
        // Matter.World.add(world, [this.ground, this.roof, this.left_wall, this.right_wall]);
    }

    display(tickerHistory = [],max = 200,mvavg=[],mvavgb=[]) {
        fill(color(118, 240, 155))
        // rect(this.ground.position.x, this.ground.position.y, width, 20);
        // rect(this.left_wall.position.x, this.left_wall.position.y, 20, height);
        // rect(this.right_wall.position.x, this.right_wall.position.y, 20, height);
        let i;
        for(i=0; i < max; i++) {
            const tvalue = tickerHistory[i];
            fill(tvalue.close > tvalue.open ? color(118, 240, 155) : color(200, 12,12))
            rect(60 +i*4,(height + 200) - tvalue.close * 10, 2, tvalue.high * 10 - tvalue.low * 10);
            rect(60 +i*4,(height + 200) - tvalue.close * 10, 4, tvalue.close * 10 - tvalue.open * 10);
            fill('yellow')
            const mvalueA = mvavg[i]
            const mvalueB = mvavgb[i]
            rect(60 +i*4,(height + 200) - mvalueA* 10, 2, 2);
            rect(60 +i*4,(height + 200) - mvalueB* 10, 2, 2);
        }
    }
}