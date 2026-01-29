/*!
 * maxill's Price-Drop
 * v1.0
 * maxill.com
 */

const priceDrop = {
    width: 500,
    height: 500,
    slots: 5,
    walls: {thickness: 10, colour: '#c32132'},
    triangles: 5,
    background: '#efe0db',
    engine: Matter.Engine.create(),
    canvas: document.getElementById('price-drop'),
    create: function(w, h, slots) {
        // Set input parameters for canvas
        this.width = Number(w);
        this.height = Number(h);
        this.slots = Number(slots);
        this.padding = this.width*0.06;
        this.triangleHeight = this.height*0.16;
        this.totalWidth = this.width-(this.padding*2)-(this.walls.thickness*2);
        this.slotWidth = (this.totalWidth-((this.slots-1)*this.walls.thickness))/this.slots;
        this.dividerGap = this.slotWidth + this.walls.thickness;

        // Initialize Matter.js
        Matter.Composite.add(this.engine.world, this.buildWalls());
        Matter.Composite.add(this.engine.world, this.buildPegs());
        Matter.Composite.add(this.engine.world, this.buildSlotDividers());
        Matter.Composite.add(this.engine.world, this.buildSensors());
        this.sensorDetectionOn();
        this.discDropEventHandler();
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, priceDrop.engine);
        Matter.Render.run(this.buildCanvas());

    },
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
    buildWalls: function () {
        const walls = [];
        // Create side walls and floor
        const leftWall = Matter.Bodies.rectangle(
            this.walls.thickness/2,
            this.height/2,
            this.walls.thickness,
            this.height, {
                render: { fillStyle: this.walls.colour },
                isStatic: true
            }
        );
        const rightWall = Matter.Bodies.rectangle(
            this.width-(this.walls.thickness/2),
            this.height/2,
            this.walls.thickness,
            this.height, {
                render: { fillStyle: this.walls.colour },
                isStatic: true
            }
        );
        const floor = Matter.Bodies.rectangle(
            this.width/2,
            this.height-(this.walls.thickness/2),
            this.width,
            this.walls.thickness, {
                render: { fillStyle: this.walls.colour },
                isStatic: true
            }
        );
        
        // Create triangles along left wall
        let y = (this.triangleHeight/2)+(this.height-this.triangleHeight*this.triangles)-this.walls.thickness-this.triangleHeight/2;
        const verticesLeft = [
            { x: 0, y: 0 },
            { x: this.padding, y: this.triangleHeight/2 },
            { x: 0, y: this.triangleHeight }
        ];
        const verticesRight = [
            { x: 0, y: this.triangleHeight/2 },
            { x: this.padding, y: 0 },
            { x: this.padding, y: this.triangleHeight }
        ];
        
        // Calculate x value of centroids
        const centerXPosLeft = (verticesLeft[0].x+verticesLeft[1].x+verticesLeft[2].x)/3;
        const centerXPosRight = (verticesRight[0].x+verticesRight[1].x+verticesRight[2].x)/3;

        for (let i=0; i<this.triangles; i++){
            const triangleLeft = Matter.Bodies.fromVertices(
                centerXPosLeft+this.walls.thickness,
                y,
                verticesLeft, {
                render: { fillStyle: this.walls.colour},
                isStatic: true
                }
            );
            const triangleRight = Matter.Bodies.fromVertices(
                this.width-centerXPosRight/2-this.walls.thickness,
                y,
                verticesRight, {
                render: { fillStyle: this.walls.colour},
                isStatic: true
                }
            );
            walls.push(triangleLeft, triangleRight);
            y = y + this.triangleHeight;
        }

        // Add side walls to slots area
        const slotWallWidth = this.padding;
        const slotWallHeight = this.triangleHeight;
        const slotWallLeft = Matter.Bodies.rectangle(
            this.padding/2+this.walls.thickness,
            this.height-(this.triangleHeight/2)-this.walls.thickness,
            slotWallWidth,
            slotWallHeight, {
                render: { fillStyle: this.walls.colour},
                isStatic: true
            }

        );
        const slotWallRight = Matter.Bodies.rectangle(
            this.width-(this.padding/2+this.walls.thickness),
            this.height-(this.triangleHeight/2)-this.walls.thickness,
            slotWallWidth,
            slotWallHeight, {
                render: { fillStyle: this.walls.colour},
                isStatic: true
            }

        );
        
        walls.push(leftWall, rightWall, floor, slotWallLeft, slotWallRight);
        return walls;
    },
    buildPegs: function() {
        const pegs = [];
        const rows = 10;
        const pegRadius = (((this.width-((this.width*0.09)*2))/this.slots)/30)
        let pegGapX = this.slotWidth + this.walls.thickness;
        let pegGapY = this.triangleHeight/2;
        let x = this.walls.thickness + this.padding + this.slotWidth/2;
        let y = (this.triangleHeight/2)+(this.height-this.triangleHeight*this.triangles)-this.walls.thickness-this.triangleHeight;
        
        for (let row=0; row < rows; row++){
            // set number of pegs per row
            let cols = 0;
            (row%2 === 0) ? cols = this.slots : cols = this.slots-1;
            for (let col=0; col < cols; col++) {
                pegs.push(Matter.Bodies.circle(
                    x,
                    y,
                    pegRadius, {
                    render: {fillStyle: '#e75757'},
                    isStatic: true,
                }));
                x = x + pegGapX;
            }
            y = y + pegGapY;
            (row%2 === 0) ? x = (this.walls.thickness + this.padding + this.slotWidth/2) + pegGapX/2 : x = this.walls.thickness + this.padding + this.slotWidth/2;
        }
        return pegs;
    },
    buildDisc: function(x) {
        const radius = (this.slotWidth/2)-(this.slotWidth*0.05);
        const disc = Matter.Bodies.circle(
            x,
            0,
            radius,{
                //render: { fillStyle: '#e75757' },
                render: {
                    sprite: {
                        texture: './heart-sprite.png'
                    }
                },
                friction: 0.1,
                restitution: Math.random() * (0.8 - 0.6) + 0.6,
                label: 'disc'
            }
        );
        return disc;
    },
    buildSlotDividers: function() {
        const dividers = [];
        const height = this.triangleHeight/2;
        let x = this.walls.thickness + this.padding + this.slotWidth + (this.walls.thickness/2);
        let y = this.height-(height/2)-this.walls.thickness;
        for (let i=0; i < this.slots-1; i++) {
            const divider = Matter.Bodies.rectangle(
                x,
                y,
                this.walls.thickness,
                height, {
                    render: { fillStyle: this.walls.colour, opacity: 0.15 },
                    isStatic: true,
                }
            )
            x = x + this.dividerGap;
            dividers.push(divider);
        }
        return dividers;
    },
    buildSensors: function() {
        const sensors = [];
        const height = this.triangleHeight/3;
        let x = this.walls.thickness + this.padding + this.slotWidth/2;
        let y = this.height-(height/2)-this.walls.thickness;
        for (let i=0; i < this.slots; i++) {
            const sensor = Matter.Bodies.rectangle(
                x,
                y,
                this.slotWidth,
                height, {
                    render: {fillStyle: '#ffffff07'},
                    isStatic: true,
                    isSensor: true,
                    label: `sensor-${i}`
                }
            )
            x = x + this.dividerGap;
            sensors.push(sensor);
        }
        return sensors;
    },
    sensorDetectionOn: function() {
        Matter.Events.on(priceDrop.engine, 'collisionStart', (event) => {
            const pairs = event.pairs;

            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];

                if (pair.bodyA.label.startsWith('sensor')) {
                    const prizeIndex = pair.bodyA.label.slice(7);
                    window.parent.postMessage(`{prize: ${prizeIndex}}`, 'https://www.maxill.com/');
                }
            }

        })
    },
    discDropEventHandler: function() {
        this.canvas.addEventListener('click', (e) => {
            let x = Number(e.clientX);
            const canvas = priceDrop.canvas.getBoundingClientRect();
            x = x - canvas.left;
            if ((x > priceDrop.walls.thickness) && x < (priceDrop.width - priceDrop.walls.thickness)) {
                Matter.Composite.add(priceDrop.engine.world, priceDrop.buildDisc(x));
            }
        }); 
    }
}


// Initialize game
priceDrop.create(500,700,7);


    


