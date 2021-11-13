
 //import './score.js'
import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
  //var kaboom = require('kaboom')
 // initialize kaboom context
 kaboom({
    width: 800,
    height:400,
    background: [ 255, 255, 255, ],
});

//loadFont("MCFont", "./assets/Font/MCFont.png", 6, 8);

const FLOOR_HEIGHT = 0;//48;



loadSprite("man", "assets/trimmed_runmananime_200.png", {
    sliceX: 16,
    sliceY: 1,
    anims:{
        "fall":{
            from: 16,
            to:16,
        },
        "jump":{
            from: 8,
            to: 15,
        },
        "run":{
            from:0,
            to:7,
            loop: true,
        },
    }
});

/*
loadSprite("man", "assets/runmananime.png", {
    sliceX: 24,
    sliceY: 1,
    anims:{
        "jump":{
            from: 23,
            to: 23,
        },
        "run":{
            from:0,
            to:22,
            loop: true,
        },
    }
});
*/
loadSprite("bag1", "assets/bags/bag1.png");
loadSprite("bag2", "assets/bags/bag2.png");
loadSprite("bag3", "assets/bags/bag3.png");


//loadSprite("train", "assets/trainBack.png");
loadSprite("train", "assets/test.png");
//loadSprite("train", "assets/doubletrain.png");
loadSprite("city", "assets/bg.png");
loadSprite("coin", "assets/coin.png");
/*
loadSprite("coin", "assets/coin_sprite.png", {
    sliceX: 10,
    sliceY: 1,
    anims:{
        "rot":{
            from: 0,
            to:5,
            loop: true,
        },
        "explo":{
            from:6,
            to:9,
        }
    }
});
*/
loadSprite("boost", "assets/booster.png");
//Booster();
//For station assets
loadSprite("StationBack", "assets/stallbg.png");
loadSprite("vadapav", "assets/station/vadapavstall.png");
loadSprite("nimbu", "assets/station/nimbupaani.png");
loadSprite("chai", "assets/station/teastall.png");
loadSprite("CharBack", "assets/station/charback.png");
loadSprite("Plus", "assets/station/plus.png");

//For sound
loadSound("coinsound", "./assets/audio/Pick Coin.mp3");

//For menu assets 
loadSprite("Male", "assets/MaleChar.png");
loadSprite("Female", "assets/FemaleChar.png");


//For ingame text 
loadSprite("CoinsLabel", "assets/coins_text.png");
loadSprite("ScoreLabel", "assets/score_text.png");
loadSprite("StaminaLabel", "assets/stamina_text.png");
loadSprite("Retry_label", "assets/try_again.png");

let SPEED = 500;    
let score = 0; 
let currency = 0;
let stamina = 51;
let JUMP_FORCE = 600;
let Gender = 0;
 let Damage = 0;

scene("game", (stamina, score, currency, SPEED, Gender) => {

 
        layers([
            "bot",
            "mid",
            "top"
        ], "top");

        gravity(1800);

        const player = add([
            sprite("man", {
                anims: "run",
            }),
            pos(50, height()),
            origin("botleft"),
            layer("top"),
            //scale(1.5), //for 100x100
            //scale(0.3),//for 1080
            scale(0.8),//for 200
            area(),
            body(),
        ]);


/*
        const player = add([
            sprite("man", {
                anims: "run",
                animSpeed:SPEED/300 + 2,
            }),
            pos(50, height()),
            origin("botleft"),
            layer("top"),
            scale(0.48), //for 100x100
            //scale(0.5),//for 1080
            area(),
            body(),
        ]);
*/
        //For jump
        function jump(){
            if (player.grounded()){
                player.jump(JUMP_FORCE);
                player.play("jump");
            };
        };

        //keyPress("space", jump);
        mouseClick(jump);
        mouseIsReleased(player.play("run"));

        mouseRelease(() => {
                player.play("run");
        });


        //for platform
        add([
            rect(width(), FLOOR_HEIGHT),
            pos(0, height()),
            outline(4),
            origin("botleft"),
            area(),
            layer("top"),
            solid(),
            color(127, 200, 255),
        ]);
        

       //add background city
       for(let j=0; j<50; j++){
          add([
              sprite("city"),
              pos(1200*j,0),
              origin("topleft"),
              area(),
              scale(0.3),
              move(LEFT, SPEED*0.2),
              layer("bot"),
          ]);

      };
         
        //add background train loop
        for(let i=0;i<80;i+=2){
            add([
                sprite("train"),
                pos((850)*i, 0),
                origin("topleft"),
                area(),
                scale(0.9),
                move(LEFT, SPEED),
                layer("mid"),
                area(),
                "train"
            ]);
        }
  
        //add background city
        add([
            sprite("city"),
            pos(0,0),
            origin("topleft"),
            area(),
            scale(0.4),
            move(LEFT, SPEED*0.3),
            layer("bot"),
        ]);
        


        // For spawning bags in loop
        function spawnBags(){
                    //add bags 
            add([
                    sprite(choose(["bag1", "bag2", "bag3"])),
                    pos(width()+rand(1200, 1500), height()),
                    area(),
                    origin("botleft"),
                    layer("top"),
                    scale(0.55),
                    move(LEFT, SPEED),
                    
                    "bag", // add a tag here
                ]);
            // wait a random amount of time to spawn next tree
            wait(rand(3, 5), (spawnBags));
            
        }

        //start spawning bags
        spawnBags();
    
        function handleoutCoin(){
            return{
                id: "handleoutCoin",
                require: ["pos"],
                update(){
                    const spos = this.screenPos()
                    if(
                        spos.x<0 ||
                        spos.x>width() ||
                        spos.y<0 ||
                        spos.y>height()
                    ){
                        this.trigger("out")
                    }
                }
            }
        }

        function AnimCoin(loc){
            const center = vec2(loc)
            const staminapos = vec2(720, 40)
                //currency+=5;
                add([
                    pos(center),
                    sprite("coin"),
                    origin("center"),
                    handleoutCoin(),
                    scale(0.4),
                    layer("mid"),
                    "SendCoin",
                    {dir: staminapos.sub(center).unit(), },
                ])
        };

        onUpdate("SendCoin", (m) => {
            m.move(m.dir.scale(100))
        })

        on("out", "SendCoin", (m) => {
            destroy(m)   
        })

        var CoinPos = 0       
 
        //For adding coins
        function spawnCoins(){
                    //add coins  
                const coin = add([
                    sprite("coin", {
                       // anims: "rot",
                    }),
                    pos(width() + rand(100, 600), height()- rand(200, 300)),
                    area(),
                    origin("botleft"),
                    layer("top"),
                    scale(0.6),
                    move(LEFT, SPEED),
                    "coin", // add a tag here
                ]);
                //coin.play("rot");

            //add score for every coin
                CoinPos = coin.pos
                var coinHeight = coin.pos.y
                player.collides("coin", () => {
                    coin.destroy();
                });
            
            coin.action(()=>{
                coin.pos.y = wave(coinHeight, coinHeight-20, time()*5);
            })
                
            // wait a random amount of time to spawn next tree
            wait(rand(4, 5), (spawnCoins));
        }

         //start spawning trees
        spawnCoins();

        //For spawning boosters
        function spawnBoost(){
                //add coins 
            var Boost = add([
                sprite("boost"),
                pos(width() + rand(1200, 1400), height() - 230),
                area(),
                origin("botleft"),
                layer("top"),
                scale(0.4),
                move(LEFT, SPEED),
                
                "boost", // add a tag here
            ]);
         
                player.collides("boost", () => {
                    Boost.destroy();
                });
            // wait a random amount of time to spawn next tree
            wait(rand(10, 15), (spawnBoost));
            
        }

        //start spawning trees
        spawnBoost();

    
        //add scores
        add([
            sprite("ScoreLabel"),
            pos(50, 24),
            scale(0.12),
            layer("top"),
        ])
        const scoreLabel = add([
            text(score),
            pos(170, 24),
            scale(0.4),
            layer("top"),
        ])
        
        //add stamina label
        add([

            sprite("StaminaLabel"),
            pos(300, 24),
            scale(0.12),
            layer("top"),
            
        ])
        const staminaLabel = add([
            text(stamina),
            pos(450, 24),
            scale(0.4),
            layer("top"),
        ])

        
        //add currency label    
        add([
            sprite("CoinsLabel"),
            pos(570, 24),
            scale(0.12),
            layer("top"),
        ])
        const currencyLabel = add([
            text(currency),
            pos(700, 24),
            scale(0.4),
            layer("top"),
        ])


        //after colliding with boosters
        player.collides("boost", () => {
            BagCollide = false; 
            SPEED = SPEED + 100;
            JUMP_FORCE += 200;
            setTimeout(Boostfunc, 10000);
        });

        function Boostfunc(){
            SPEED = SPEED - 100;
            BagCollide = true;
            JUMP_FORCE -= 200;
        };

        // lose if player collides with any game obj with tag "bag"
        if(BagCollide){
                player.collides("bag", () => {
                    //staminaLabel.color = hsl2rgb(wave(0, 0.2*Damage , time(1)), 0.5, 0.5);
                    Damage+=1;
                    shake(10);
                    stamina-=10;
                    if(Damage==3){
                        shake();
                        destroy(player);
                        go("lose", Math.floor(score));// go to "lose" scene here
                        burp();
                        shake(10);
                        Damage = 0;
                    };
                    if(Damage>0 && stamina<=10){
                        shake();
                        destroy(player);
                        go("lose", Math.floor(score));// go to "lose" scene here
                        burp();
                        shake(10);
                        Damage = 0;
                    };
                });
        };

        player.collides("coin", () => {
                    currency = currency + 5;
                    //AnimCoin(CoinPos);
                    CoinPos = vec2(720, 100)
                    AnimCoin(CoinPos);
                    play("coinsound", {
                        volume: 0.5
                    });
                });


        // increment score every frame
        action(() => {
            score+=0.2;
            scoreLabel.text = Math.floor(score) ;
            scoreLabel.color = rgb(255, 255, 255);

            currencyLabel.text = currency;
            currencyLabel.color = rgb(255, 215, 0);
            //stamina calc
            stamina = stamina - (0.01);
            staminaLabel.text = Math.floor(stamina); 
            staminaLabel.color = rgb( 255*Damage, 255 - 155*Damage, 0);
            if(stamina < 1){
                if(currency>=5){
                    go("station",Math.floor(stamina), Math.floor(score), currency, SPEED);// go to "lose
                }else{
                    go("lose", Math.floor(score));
                };
            };
        });        

});

scene("station", (stamina, score, currency, SPEED) => {
    gravity(2000);
    layers([
        "bot",
        "mid",
        "top"
    ], "top");

    
    const VadaPav = add([
        sprite("vadapav"),
        pos(width()-500, height()-80),
        origin("center"),
        layer("mid"),
        area(),
        scale(0.23),
        "VadaPav"
    ]);

    VadaPav.action(() => {
        //VadaPav.scale = wave(0.23, 0.25, time()*4.1);
        VadaPav.pos.y = wave(height()-80, height()-90, time()*4.5);
    });



    const NimbuPani = add([
        sprite("nimbu"),
        pos(width()-700, height()-80),
        origin("center"),
        layer("mid"),
        area(),
        scale(0.25),
        "NimbuPani"
    ]);
    


    NimbuPani.action(() => {
        NimbuPani.pos.y = wave(height()-80, height()-90, time()*4.3);
    });


    const Chai = add([
        sprite("chai"),
        pos(width()-200, height()-80),
        origin("center"),
        layer("mid"),
        area(),
        scale(0.25),
        "Chai"
    ]);

    Chai.action(() => {
        //Chai.scale = wave(0.25, 0.27, time()*4.9);
        Chai.pos.y = wave(height()-80, height()-90, time()*4.1);
    });


    //for background/
    add([
        sprite("StationBack"),
        pos(0, 0),
        origin("topleft"),
        area(),
        scale(0.8, 0.75),
        layer("bot"),
    ]);

     //for character 
     const PlayerBack = add([
        sprite("CharBack"),
        pos(width()-500, height()),
        origin("botleft"),
        area(),
        scale(0.8),
        layer("top")
    ]);
     //for platform
     add([
        rect(width(), FLOOR_HEIGHT),
        pos(0, height()),
        outline(4),
        origin("botleft"),
        area(),
        solid(),
    ]);

    
      //add scores
        add([
            sprite("ScoreLabel"),
            pos(50, 24),
            scale(0.12),
            layer("top"),
        ])
        const scoreLabel = add([
            text(score),
            pos(170, 24),
            scale(0.4),
            layer("top"),
        ])
        
        //add stamina label
        add([

            sprite("StaminaLabel"),
            pos(300, 24),
            scale(0.12),
            layer("top"),
            
        ])
        const staminaLabel = add([
            text(stamina),
            pos(450, 24),
            scale(0.4),
            layer("top"),
        ])

        
        //add currency label    
        add([
            sprite("CoinsLabel"),
            pos(570, 24),
            scale(0.12),
            layer("top"),
        ])
        const currencyLabel = add([
            text(currency),
            pos(700, 24),
            scale(0.4),
            layer("top"),
        ])


        function handleout(){
            return{
                id: "handleout",
                require: ["pos"],
                update(){
                    const spos = this.screenPos()
                    if(
                        spos.x<0 ||
                        spos.x>width() ||
                        spos.y<0 ||
                        spos.y>height()
                    ){
                        this.trigger("out")
                    }
                }
            }
        }

        function heal(loc){
            const center = vec2(loc)
            const staminapos = vec2(450, 24)
                stamina+=5;
                currency-=5;
                add([
                    pos(center),
                    sprite("Plus"),
                    origin("center"),
                    handleout(),
                    scale(0.5),
                    "Plus",
                    {dir: staminapos.sub(center).unit(), },
                ])
        };
        
    
        onClick( "VadaPav", ()=>{
            heal(VadaPav.pos);
        })

        onClick("NimbuPani", ()=>{
            heal(NimbuPani.pos);
        })

        onClick("Chai", ()=>{
            heal(Chai.pos);
        })
 
        touchStart( "VadaPav", ()=>{
                   heal(VadaPav.pos);
               })

        touchStart("NimbuPani", ()=>{
            heal(NimbuPani.pos);
        })

        touchStart("Chai", ()=>{
            heal(Chai.pos);
        })
     
        onUpdate("Plus", (m) => {
            m.move(m.dir.scale(SPEED/2))
        })

        on("out", "Plus", (m) => {
            destroy(m)
            stamina+=1;
            //currency-=5;
            if(currency<0){
                go("game", stamina, score, currency=0, SPEED+30, Gender);// go to "game
            };
            go("game", stamina, score, currency, SPEED+30, Gender);// go to "game
                
        })
    /*    
   function Regen(){
        stamina+=11;
        currency-=5;
        burp();
        wait(3, go("game", stamina, score, currency, SPEED+30, Gender));// go to "lose

   };
    mouseRelease(Regen);
    */
})

//Scene after lost/ colliding with the bag
scene("lose",  (score) => {
     add([
        sprite("Retry_label"),
        pos(width()/4, height()/2 - 80),
        origin("center"),
        scale(0.25),
        "retry"
    ]);

    add([
        sprite("ScoreLabel"),
        pos(width()/4-50, height()/2),
        scale(0.25),
        origin("center"),
    ]);

    add([
        text(score),
        pos(width()/4 + 150, height()/2+10),
        origin("center"),
    ]);

    // go back to game with space is pressed
    keyPress("space", () => go("game", stamina, score=0, currency, SPEED, Gender));
    mouseClick(() => go("game", stamina, score=0, currency, SPEED, Gender));

});



scene("menu", () => {
    
    let BagCollide = true;
    fullscreen(BagCollide);
    
    const Male = add([
        sprite("Male"),
        pos(0, 0),
        origin("topleft"),
        scale(1.5), //for 100x100
        area(),
        "Male"
    ])

    const Female = add([
        sprite("Female"),
        pos(width()/2, 0),
        origin("topleft"),
        scale(1.5), //for 100x100
        area(),
        "Female"
    ])

    onClick("Male", ()=>{
        go("game", stamina = 51, score = 0, currency = 0, SPEED = 550, Gender = 0);
        //fullscreen(true);
 
    })

    onClick( "Female", ()=>{
        Gender = 1;
        go("game", stamina = 51, score = 0, currency = 0, SPEED = 550, Gender = 1);
        //fullscreen(true);
   
    })
})
scene("main", () => {
    
    let BagCollide = true;
    fullscreen(BagCollide);

    const Play = add([
        sprite("Play"),
        pos(0, 0),
        origin("topleft"),
        scale(1.5), //for 100x100
        area(),
        "Play"
    ])

    onClick("Play", ()=>{
        go("menu");
        //fullscreen(true);
    })

})

//go("station");
//go("menu");
go("main");
//go("game", stamina, score, currency, SPEED);
//go("menu");
