/*!
 * maxill's Price-Drop
 * v1.0
 * maxill.com
 */


const priceDrop = {
    width: 400,
    height: 500,
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
 
        let triangleRadius = this.width*0.06;
        // Draw triangles down left side
        let leftX = triangleRadius/2;
        let leftY = this.height*0.17/2 + this.height*0.09;
        for (let i=0; i < 5; i++){
            const triangle = Matter.Bodies.polygon(
                leftX, leftY, 3, triangleRadius, {
                    render: { fillStyle: this.walls.colour },
                    isStatic: true
                }
            );
            // Stretch and rotate triangle
            Matter.Body.rotate(triangle, Math.PI / 1);
            Matter.Body.scale(triangle, 1, (this.height/5)/triangleRadius);
            walls.push(triangle);
            leftY = leftY + this.height*0.17;
        }

        // Draw triangles down right side
        let rightX = this.width - triangleRadius/2;
        let rightY = this.height*0.17/2 + this.height*0.09;
        for (let i=0; i < 5; i++){
            const triangle = Matter.Bodies.polygon(
                rightX, rightY, 3, triangleRadius, {
                    render: { fillStyle: this.walls.colour },
                    isStatic: true
                }
            );
            // Stretch triangle
            Matter.Body.scale(triangle, 1, (this.height/5)/triangleRadius);
            walls.push(triangle);
            rightY = rightY + this.height*0.17;
        }

        // Draw bottom wall blocks
        const bottomBlockHeight = this.height-((this.height*0.17)*5);
        const leftBlock = Matter.Bodies.rectangle(
            this.width*0.09/2, 
            this.height-(this.height*0.17/2)+this.walls.thickness, 
            this.width*0.09, 
            bottomBlockHeight, { 
                render: { fillStyle: this.walls.colour }, 
                isStatic: true
        });
        const rightBlock = Matter.Bodies.rectangle(
            this.width-this.width*0.09/2, 
            this.height-(this.height*0.17/2)+this.walls.thickness, 
            this.width*0.09, 
            bottomBlockHeight, { 
                render: { fillStyle: this.walls.colour }, 
                isStatic: true
        });
        walls.push(leftBlock);
        walls.push(rightBlock);
        return walls;
    },
    buildPegs: function() {
        const blockHeight = this.height-((this.height*0.17)*5);
        const pegs = [];
        const rows = 10;
        let pegGapX = (this.width-(this.width*0.18))/this.slots;
        let pegGapY = (this.height*0.17)/2;
        let x = pegGapX;
        let y = this.height-(pegGapY*rows)-blockHeight/2.75;
        
        for (let row=0; row < rows; row++){
            
            // set number of pegs per row
            let cols = 0;
            (row%2 === 0) ? cols = this.slots : cols = this.slots-1;
            for (let col=0; col < cols; col++) {
                pegs.push(Matter.Bodies.circle(
                    x,
                    y,
                    3/* {{this should maybe be dynamic based on slot/disc size}} */, {
                    render: {fillStyle: '#fff'},
                    isStatic: true,
                }));
                x = x + pegGapX;
            }
            y = y + pegGapY;
            (row%2 === 0) ? x = pegGapX+(pegGapX/2) : x = pegGapX;
        }
        return pegs;
    },
    buildDisc: function(x) {
        const radius = (((this.width-((this.width*0.09)*2))/this.slots)/4);
        const disc = Matter.Bodies.circle(
            x,
            0,
            radius,{
                render: { fillStyle: 'orange' },
                friction: 0.1,
                restitution: 0.7
            }
        );
        return disc;
    }

}


    Matter.Composite.add(priceDrop.engine.world, priceDrop.buildWalls());
    Matter.Composite.add(priceDrop.engine.world, priceDrop.buildPegs());

    Matter.Composite.add(priceDrop.engine.world, priceDrop.buildDisc(88));
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, priceDrop.engine);
    Matter.Render.run(priceDrop.buildCanvas());


