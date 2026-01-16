/*!
 * maxill's Price-Drop
 * v1.0
 * maxill.com
 */


const priceDrop = {
    width: 400,
    height: 600,
    slots: 5,
    walls: {thickness: 10, colour: '#1c75bc'},
    background: '#00205c',
    engine: Matter.Engine.create(),
    canvas: document.getElementById('price-drop'),
    buildCanvas: function (){
        return Matter.Render.create({
        canvas: this.canvas,
        engine: this.engine,
        options: {
            width: this.width,
            height: this.height,
            wireframes: false,
            background: this.background
        }
        });
    },
    buildWalls: function (){
        const walls = [Matter.Bodies.rectangle(
                this.width/2, 
                this.height - this.walls.thickness/2, 
                this.width, 
                this.walls.thickness, {
            render: { fillStyle: this.walls.colour},
            isStatic: true,
            }),
        Matter.Bodies.rectangle(
                this.walls.thickness/2, 
                this.height/2, 
                this.walls.thickness, 
                this.height, {
            render: { fillStyle: this.walls.colour},
            isStatic: true,
            }),
        Matter.Bodies.rectangle(
                this.width - this.walls.thickness/2, 
                this.height/2, 
                this.walls.thickness, 
                this.height, {
            render: { fillStyle: this.walls.colour},
            isStatic: true,
            })
        ];
 
        // Draw triangles down left side
        let leftX = this.width*0.06/2;
        let leftY = this.height*0.17/2 + this.height*0.09;
        for (let i=0; i < 5; i++){
            const triangle = Matter.Bodies.polygon(
                this.width*0.06-this.walls.thickness, leftY, 3, this.width*0.06, {
                    render: { fillStyle: this.walls.colour },
                    isStatic: true
                }
            );
            // Stretch and rotate triangle
            Matter.Body.rotate(triangle, Math.PI / 1);
            Matter.Body.scale(triangle, 1, (this.height*0.17)/(this.width*0.06));
            walls.push(triangle);
            leftY = leftY + this.height*0.17;
        }

        // Draw triangles down right side
        let rightX = this.width - this.width*0.06/2;
        let rightY = this.height*0.17/2 + this.height*0.09;
        for (let i=0; i < 5; i++){
            const triangle = Matter.Bodies.polygon(
                rightX, rightY, 3, this.width*0.06, {
                    render: { fillStyle: this.walls.colour },
                    isStatic: true
                }
            );
            // Stretch triangle
            Matter.Body.scale(triangle, 1, (this.height*0.17)/(this.width*0.06));
            walls.push(triangle);
            rightY = rightY + this.height*0.17;
        }

        // Draw bottom wall blocks
        const leftBlock = Matter.Bodies.rectangle(
            this.width*0.12/2-this.walls.thickness, 
            this.height-(this.height*0.17/2)+this.walls.thickness, 
            this.width*0.12, 
            this.height-((this.height*0.17)*5), { 
                render: { fillStyle: this.walls.colour }, 
                isStatic: true
        });
        const rightBlock = Matter.Bodies.rectangle(
            this.width-this.width*0.06/2, 
            this.height-(this.height*0.17/2)+this.walls.thickness, 
            this.width*0.12, 
            this.height-((this.height*0.17)*5), { 
                render: { fillStyle: this.walls.colour }, 
                isStatic: true
        });
        walls.push(leftBlock);
        walls.push(rightBlock);
        return walls;
    },
    buildPegs: function() {
        const pegs = [];
        let x = 0;
        let y = 35;
        const rows = 10;
        for (let row=0; row < rows; row++){
            y = y + 50;
            // set number of pegs per row
            let cols = 0;
            (row%2 === 0) ? cols = this.slots : cols = this.slots-1;
            for (let col=0; col < cols; col++) {
                x = x + 50
                pegs.push(Matter.Bodies.circle(
                    x,
                    y,
                    3, {
                    render: {fillStyle: '#fff'},
                    isStatic: true,
                }));
            }
            (row%2 === 0) ? x = 20 : x = 10;
        }
        return pegs;
    }
}


    Matter.Composite.add(priceDrop.engine.world, priceDrop.buildWalls());
    Matter.Composite.add(priceDrop.engine.world, priceDrop.buildPegs());
    
    Matter.Composite.add(priceDrop.engine.world, Matter.Bodies.circle(30, 0, 20, {friction: 0.1, restitution: 0.7}));
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, priceDrop.engine);
    Matter.Render.run(priceDrop.buildCanvas());


