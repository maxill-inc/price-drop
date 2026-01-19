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
    padding: 0.06,
    triangles: 5,
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
        const padding = this.width*this.padding;
        const triangleHeight = this.height*0.16;
        let y = (triangleHeight/2)+(this.height-triangleHeight*this.triangles)-this.walls.thickness-triangleHeight/2;
        const verticesLeft = [
            { x: 0, y: 0 },
            { x: padding, y: triangleHeight/2 },
            { x: 0, y: triangleHeight }
        ];
        const verticesRight = [
            { x: 0, y: triangleHeight/2 },
            { x: padding, y: 0 },
            { x: padding, y: triangleHeight }
        ];
        
        // Calculate x value of centroids
        const centerXPosLeft = (verticesLeft[0].x+verticesLeft[1].x+verticesLeft[2].x)/3;
        const centerXPosRight = (verticesRight[0].x+verticesRight[1].x+verticesRight[2].x)/3;

        for (let i=0; i<this.triangles; i++){
            const triangleLeft = Matter.Bodies.fromVertices(
                centerXPosLeft+this.walls.thickness,
                y,
                verticesLeft, {
                render: { fillStyle: 'yellow'},
                isStatic: true
                }
            );
            const triangleRight = Matter.Bodies.fromVertices(
                this.width-centerXPosRight/2-this.walls.thickness,
                y,
                verticesRight, {
                render: { fillStyle: 'green'},
                isStatic: true
                }
            );
            walls.push(triangleLeft, triangleRight);
            y = y + triangleHeight;
        }

        // Add side walls to slots area
        const slotWallWidth = padding;
        const slotWallHeight = triangleHeight;
        const slotWallLeft = Matter.Bodies.rectangle(
            padding/2+this.walls.thickness,
            this.height-(triangleHeight/2)-this.walls.thickness,
            slotWallWidth,
            slotWallHeight, {
                render: { fillStyle: '#c007'},
                isStatic: true
            }

        );
        const slotWallRight = Matter.Bodies.rectangle(
            this.width-(padding/2+this.walls.thickness),
            this.height-(triangleHeight/2)-this.walls.thickness,
            slotWallWidth,
            slotWallHeight, {
                render: { fillStyle: '#c007'},
                isStatic: true
            }

        );
        
        walls.push(leftWall, rightWall, floor, slotWallLeft, slotWallRight);
        return walls;
    },
    buildPegs: function() {
        const blockHeight = this.height-((this.height*0.17)*5);
        const totalWidth = (this.width-((this.width*0.09)*2));
        const pegs = [];
        const rows = 10;
        const pegRadius = (((this.width-((this.width*0.09)*2))/this.slots)/30)
        let pegGapX = totalWidth/this.slots;
        let pegGapY = (this.height*0.17)/2;
        let x = totalWidth-(pegGapX*(this.slots))+(this.width*0.09)+(pegGapX/2);
        let y = this.height-(pegGapY*rows)-blockHeight/2.75;
        
        for (let row=0; row < rows; row++){
            
            // set number of pegs per row
            let cols = 0;
            (row%2 === 0) ? cols = this.slots : cols = this.slots-1;
            for (let col=0; col < cols; col++) {
                pegs.push(Matter.Bodies.circle(
                    x,
                    y,
                    pegRadius, {
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
    },
    buildSlotDividers: function() {
        const dividers = [];
        const totalWidth = (this.width-((this.width*0.09)*2));
        const height = 40;
        const dividerGap = totalWidth/this.slots+(this.walls.thickness/(this.slots-1));
        let x = (this.width*0.09)+dividerGap-(this.walls.thickness/2);
        let y = this.height-(height/2)-this.walls.thickness;
        for (let i=0; i < this.slots-1; i++) {
            const divider = Matter.Bodies.rectangle(
                x,
                y,
                this.walls.thickness,
                height, {
                    render: { fillStyle: 'red' },
                    isStatic: true
                }
            )
            x = x + dividerGap;
            dividers.push(divider);
        }
        return dividers;
    }

}


    Matter.Composite.add(priceDrop.engine.world, priceDrop.buildWalls());
    Matter.Composite.add(priceDrop.engine.world, priceDrop.buildPegs());
    Matter.Composite.add(priceDrop.engine.world, priceDrop.buildSlotDividers());
    Matter.Composite.add(priceDrop.engine.world, priceDrop.buildDisc(88));



    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, priceDrop.engine);
    Matter.Render.run(priceDrop.buildCanvas());


