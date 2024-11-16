//Steps to run this
// 1 get Node js to run this
// 2 run - npm run div to run the website for testing
// 3 run - npm run build to build the app, it will create a dist folder, thats the folder you want to put on the netlify


//Gets all the other js files so that we can access it
import { dialogueData, scaleFactor,scalessFactor } from "./constants";
import { k } from "./kaboomCtx";
import { displayDialogue, setCamScale } from "./utils";

// Load the audio file
const open = new Audio('open.mp3');
const walking = new Audio('walking.mp3');
let audio;
//Plays the audio
const playAudio = () => {
    if (!audio) {
        audio = new Audio('bgm.mp3');
        audio.loop = true;
    }
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
    });
};
playAudio()

//loads sprites
k.loadSprite("spritesheet" // saves the sprite to a variable
    ,"./spritesheet.png",{ //what sprite to get
    sliceX:39,//How many sprites it have on X axis, Use TILED to make things easier
    sliceY:31, // How many sprites it have on Y axis
    anims:{ // Animation Library **Common**
        "idle-down":948,
        "walk-down":{from:948,to:951,loop:true,speed:8},//"From" means where to start the animation, "to" is where to end it
        "idle-side":987,
        "walk-side":{from:987,to:990,loop:true,speed:8},
        "idle-up":1026,
        "walk-up":{from:1026,to:1029,loop:true,speed:8},
        "idle-chest":137,
        "chest-open":{from:137,to:138,loop:false,speed:4},
        "chest-close":{from:138,to:137,loop:false,speed:4},
    },
});
k.loadSprite("waterfall",//Load another sprite and add it to a variable
    "mapsprites/gentle waterfall A v01.png",{
    sliceX:6,
    sliceY:9,
    anims:{
        "waterfall1":{from:6,to:11,loop:true,speed:4},
        "waterfall2":{from:12,to:17,loop:true,speed:4},
        "waterfall3":{from:18,to:23,loop:true,speed:4},
        "waterfall4":{from:12,to:17,loop:true,speed:4},
        "splash":{from:36,to:41,loop:true,speed:4},
        "splash1":{from:42,to:47,loop:true,speed:4},
    },
});

k.loadSprite("map","./othermap.png");//Load the map sprite and save it to a variable

k.setBackground(k.Color.fromHex("#FFECB8")); // Set the background of the world or the working space

k.scene("main",async () =>{
    const mapData = await (await fetch("./othermap.json")).json() // waits for the system to fetch the map
    const layers = mapData.layers; // access all layers in the map

    const map = k.add([
        k.sprite("map"),//add the sprite
        k.pos(0),//positions it
        k.scale(scaleFactor) // how big it is
    ]);
    const player = k.make([k.sprite("spritesheet",{anim:"idle-down"}),// The System Makes the sprite
        k.area({
       shape: new k.Rect(k.vec2(0,3),10,10),//create hitbox automatically from X =0 to X = 3, creating a rectangle
       
    }),
    k.body(),
    k.anchor("center"),// Anchor the player idk about this one
    k.pos(),// Where he is, leave it blank cause we will put him where we want him to a code
    k.scale(scaleFactor), // Scale the mf
    {
        speed:250, // How fast
        direction:"down", // The players default direction
        isInDialogue:false, // Checks if the player is in the dialogue screen

    },
    "player",// Saves him to a variable
    ]);
    const chest1 = k.make([ // Same as creating a player, mostly used to animated characters, mobs, or npc
        k.sprite("spritesheet", { anim: "idle-chest" }),
        k.area(),  // Add back hitbox for collision detection leave it empty so players dont push it around
        k.anchor("center"),
        k.pos(),
        k.scale(3),
        {
            direction: "down",
        },
        "chest",
    ]);
    const chest2 = k.make([
        k.sprite("spritesheet", { anim: "idle-chest" }),
        k.area(),  // Add back hitbox for collision detection
        k.anchor("center"),
        k.pos(),
        k.scale(3),
        {
            direction: "down",
        },
        "chest",
    ]);
    const chest3 = k.make([
        k.sprite("spritesheet", { anim: "idle-chest" }),
        k.area(),  // Add back hitbox for collision detection
        k.anchor("center"),
        k.pos(),
        k.scale(3),
        {
            direction: "down",
        },
        "chest",
    ]);
    const chest4 = k.make([
        k.sprite("spritesheet", { anim: "idle-chest" }),
        k.area(),  // Add back hitbox for collision detection
        k.anchor("center"),
        k.pos(),
        k.scale(3),
        {
            direction: "down",
        },
        "chest",
    ]);
    const chest5 = k.make([
        k.sprite("spritesheet", { anim: "idle-chest" }),
        k.area(),  // Add back hitbox for collision detection
        k.anchor("center"),
        k.pos(),
        k.scale(3),
        {
            direction: "down",
        },
        "chest",
    ]);
    const waterfalls = []; //creates a list to store the animations of the water fall this is the method to creating animated backgrounds
    for (let i = 1; i <= 8; i++) {
        
            let anim = (i <= 2) ? "waterfall1" : 
                       (i <= 4) ? "waterfall2" : 
                       (i <= 6) ? "waterfall3" : 
                       "waterfall4";
        waterfalls.push(k.make([
            k.sprite("waterfall", { anim: anim }),
            k.area(),
            k.anchor("center"),
            k.pos(),
            k.scale(4),
            { direction: "down" },
            "waterfall",
        ]));
    }
        const splashs = [];
        for (let i = 1; i <= 8; i++) {
            let anim;
            if (i === 1 || i === 2) {
                anim = "splash"; // For splash1 and splash2
            } else if (i === 3 || i === 4) {
                anim = "splash1"; // For splash3 and splash4
            } else {
                anim = "default"; // Handle any other cases if needed
            }
            splashs.push(k.make([
                k.sprite("waterfall", { anim: anim }),
                k.area(),
                k.anchor("center"),
                k.pos(),
                k.scale(4),
                { direction: "down" },
                "splash" + i,
            ]));
    }
    
    
    for(const layer of layers){ // Gets all layers of the map
        if(layer.name == "boundaries"){ // Checks for layers in the map that is named "boundaries" ** Check the TILED app for this to gain more insight**
            for(const boundary of layer.objects){
                map.add([ // Now the system loads up the map and all layers and boundaries just copy paste it
                    k.area({
                        shape: new k.Rect(k.vec2(0),boundary.width,boundary.height),

                    }),
                    k.body({ isStatic:true}),
                    k.pos(boundary.x,boundary.y),
                    boundary.name,
                ]);
                let currentOpenChest = null; // This is for checking if a chest was being open

                if (boundary.name) {
                    player.onCollide(boundary.name, () => {
                        
                        if (boundary.name === "ref") { // Check if theres a boundary named "ref" so we can make the player do some action when hitting it
                            if (currentOpenChest) {
                                currentOpenChest.play("chest-close");//plays close chest when players are not on it
                            }
                            chest1.play("chest-open");//plays open chest when players are on it
                            currentOpenChest = chest1;//sets the currently opened chest as chest 1
                        }
                        if (boundary.name === "house") {
                            if (currentOpenChest) {
                                currentOpenChest.play("chest-close");
                            }
                            chest2.play("chest-open");
                            currentOpenChest = chest2;
                        }
                        if (boundary.name === "bed") {
                            if (currentOpenChest) {
                                currentOpenChest.play("chest-close");
                            }
                            chest3.play("chest-open");
                            currentOpenChest = chest3;
                        }
                        if (boundary.name === "table") {
                            if (currentOpenChest) {
                                currentOpenChest.play("chest-close");
                            }
                            chest4.play("chest-open");
                            currentOpenChest = chest4;
                        }
                        if (boundary.name === "pc") {
                            if (currentOpenChest) {
                                currentOpenChest.play("chest-close");
                            }
                            chest5.play("chest-open");
                            currentOpenChest = chest5;
                        }
                    
                        // Handle dialogue display for all boundaries
                        player.isInDialogue = true; // makes the system knows the player is in a dialouge
                        if(boundary.name != "waterfalla"){
                        open.currentTime=0; //plays opening sound of a chest
                        open.play().then(() => {
                            console.log('Audio is playing');
                        }).catch(error => {
                            console.error('Error playing audio:', error);
                        });
                        }
                        
                        displayDialogue(dialogueData[boundary.name], () => { //calls the dialouge data from the constant that has the same key value as the current colliding boundary **just look at the const it has same name key as the boundary
                            player.isInDialogue = false; //Release the player from dialogue
                           
                            // Close the currently open chest if there is one
                            if (currentOpenChest) {
                                currentOpenChest.play("chest-close");
                                currentOpenChest = null;  // Reset after closing
                            }
                        });
                    });
                   
                }
                
            }
           
            continue;
        }
    if (layer.name === "point") { //Theres a spawn boundary on tiled this function make it so that we can spawn our player on the "point" boundary
        for (const entity of layer.objects) {
            if (entity.name === "player") {
                k.add(player);
                player.pos = k.vec2(
                    (map.pos.x + entity.x) * scaleFactor,
                    (map.pos.y + entity.y) * scaleFactor
                );
               
                continue;
            }    
            //this function puts the chest as the same as the other spawn boundaries you can copy this or just copy the player spawning function
            function handleChestCollision(chest, entity) {
                k.add(chest);
                
                // Set chest position using point layer coordinates, bypassing boundaries
                chest.pos = k.vec2(
                    entity.x * scaleFactor,  // No boundaries affecting the position
                    entity.y * scaleFactor
                );
                // Optionally, adjust for map position if needed
                chest.pos.add(map.pos.x * scaleFactor, map.pos.y * scaleFactor);
            }
            
            if (entity.name === "chest1") {
                handleChestCollision(chest1, entity);
                continue;
            }
            if (entity.name === "chest2") {
                handleChestCollision(chest2, entity);
                continue;
            }
            if (entity.name === "chest3") {
                handleChestCollision(chest3, entity);
                continue;
            }
            if (entity.name === "chest4") {
                handleChestCollision(chest4, entity);
                continue;
            }
            if (entity.name === "chest5") {
                handleChestCollision(chest5, entity);
                continue;
            }
            //same function as the chests
            const handleWaterfall = (waterfall, entity) => {
                k.add(waterfall);
                waterfall.pos = k.vec2(
                    entity.x * scaleFactor,
                    entity.y * scaleFactor
                );
                waterfall.pos.add(map.pos.x * scaleFactor, map.pos.y * scaleFactor);
            };

            // Assign waterfalls
            if (entity.name.startsWith("waterfall")) {
                const index = parseInt(entity.name.replace("waterfall", "")) - 1;
                if (index < waterfalls.length) {
                    handleWaterfall(waterfalls[index], entity);
                }
            }
        
            if (entity.name === "splash1") {
                const splash1 = k.make([
                    k.sprite("waterfall", { anim: "splash1" }), // Use "splash" animation
                    k.area(),
                    k.anchor("center"),
                    k.pos(),
                    k.scale(4),
                    { direction: "down" },
                    "splash",
                ]);
                splash1.pos = k.vec2(
                    (map.pos.x + entity.x) * scaleFactor,
                    (map.pos.y + entity.y) * scaleFactor
                );
                k.add(splash1); // Add splash1 to the scene
                continue;
            }
        
            if (entity.name === "splash2") {
                const splash2 = k.make([
                    k.sprite("waterfall", { anim: "splash1" }), // Use "splash" animation
                    k.area(),
                    k.anchor("center"),
                    k.pos(),
                    k.scale(4),
                    { direction: "down" },
                    "splash",
                ]);
                splash2.pos = k.vec2(
                    (map.pos.x + entity.x) * scaleFactor,
                    (map.pos.y + entity.y) * scaleFactor
                );
                k.add(splash2); // Add splash2 to the scene
                continue;
            }
        
            if (entity.name === "splash3") {
                const splash3 = k.make([
                    k.sprite("waterfall", { anim: "splash" }), // Use "splash1" animation
                    k.area(),
                    k.anchor("center"),
                    k.pos(),
                    k.scale(4),
                    { direction: "down" },
                    "splash",
                ]);
                splash3.pos = k.vec2(
                    (map.pos.x + entity.x) * scaleFactor,
                    (map.pos.y + entity.y) * scaleFactor
                );
                k.add(splash3); // Add splash3 to the scene
                continue;
            }
        
            if (entity.name === "splash4") {
                const splash4 = k.make([
                    k.sprite("waterfall", { anim: "splash" }), // Use "splash1" animation
                    k.area(),
                    k.anchor("center"),
                    k.pos(),
                    k.scale(4),
                    { direction: "up" },
                    "splash",
                ]);
                splash4.pos = k.vec2(
                    (map.pos.x + entity.x) * scaleFactor,
                    (map.pos.y + entity.y) * scaleFactor
                );
                k.add(splash4); // Add splash4 to the scene
                continue;
            }
        }
        
    }
 
}   //set the camera
    setCamScale(k)
    k.onResize(()=>{
        setCamScale(k)
    });
    k.onUpdate(()=>{ //Nasunod sa player camera
        k.camPos(player.pos.x,player.pos.y + 100)
    });
    // Variables to track the current walking state
let isWalking = false;

//Walking state ng character
k.onMouseDown((mouseBtn) => {
    // Ensure the left mouse button is pressed and the player is not in dialogue
    if (mouseBtn !== "left" || player.isInDialogue) return;

    const worldMousePos = k.toWorld(k.mousePos());
    player.moveTo(worldMousePos, player.speed);

    const mouseAngle = player.pos.angle(worldMousePos); // Get angle
    const lowerBound = 50;
    const upperBound = 125;

    // Check direction based on mouse angle and play corresponding animation
    if (mouseAngle > lowerBound && mouseAngle < upperBound && player.curAnim() !== "walk-up") {
        player.play("walk-up"); // Plays animatin based on where the user types in
        player.direction = "up";// Sets the characters default facing position
    } else if (mouseAngle < -lowerBound && mouseAngle > -upperBound && player.curAnim() !== "walk-down") {
        player.play("walk-down");
        player.direction = "down";
    } else if (Math.abs(mouseAngle) > upperBound) {
        player.flipX = false; // Face right
        if (player.curAnim() !== "walk-side") {
            player.play("walk-side");
            player.direction = "right";
        }
    } else if (Math.abs(mouseAngle) < lowerBound) {
        player.flipX = true; // Face left
        if (player.curAnim() !== "walk-side") {
            player.play("walk-side");
            player.direction = "left";
        }
    }

    // Play walking audio only if not already walking
    if (!isWalking) {
        walking.currentTime = 0; // Reset audio playback time
        walking.loop = true; // Ensure it loops
        walking.play().then(() => {
            console.log('Walking audio is playing');
            isWalking = true; // Update walking state
        }).catch(error => {
            console.error('Error playing walking audio:', error);
        });
    }
});

// Stop the walking audio when the mouse is released
k.onMouseRelease(() => {
    // Stop the walking audio if it's currently playing
    if (isWalking) {
        walking.pause(); // Pause the walking audio
        isWalking = false; // Reset walking state
        console.log('Walking audio is paused');
    }

    // Set the player's idle animation based on the last direction
    if (player.direction === "down") {
        player.play("idle-down");
    } else if (player.direction === "up") {
        player.play("idle-up");
    } else {
        player.play("idle-side");
    }
});


});

k.go("main");// Run the whole main