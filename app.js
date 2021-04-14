class Ship {
    constructor(name, hull, firepower, accuracy) {
        this.name=name;
        this.hull=hull;
        this.firepower=firepower;
        this.accuracy=accuracy;
    }
}
class GoodGuy extends Ship {
    constructor(name) {
        super(name,20,5,.7);
        this.missileNum = Math.ceil(Math.random()*4);
        this.useMissile=false;
        GoodGuy.player=this;
        console.log(`Below are your ship stats. Your missiles do 2x firepower damage - but you have a limited number to use.`)
        game.displayStats();
        startGame();
    }
    attackAlien=attackAlien;
    shields=shields;
    static player={};
}
class Alien extends Ship {
    constructor() {
        Alien.alienNum++;
        super(`Alien Ship ${Alien.alienNum}`,Math.floor(Math.random()*4)+3,Math.floor(Math.random()*3)+2,(Math.floor(Math.random()*3)+6)/10)
        Alien.alienShips.push(this);
    };
    static alienNum=0;
    static alienShips=[];
    static alienMax=Math.floor(Math.random()*5)+6;
    alienAttack=alienAttack;
}
const game = {
    alienShipsDestroyed: 0,
    logAlienShips: function() {Alien.alienShips.forEach(element => console.log(`${element.name}`))},
    displayStats: function() {
        console.log(`${GoodGuy.player.name} ship stats:
            Hull strength: ${GoodGuy.player.hull}
            Firepower: ${GoodGuy.player.firepower}
            Accuracy: ${GoodGuy.player.accuracy}
            Missiles: ${GoodGuy.player.missileNum}`);
    },
}
function startGame() {
    for (let i=0; i<Alien.alienMax; i++) {
        new Alien;
    };
    console.log(`You see ${Alien.alienMax} alien ships coming at ${GoodGuy.player.name}!`);
    game.logAlienShips();
    console.log(`To load a missile for your next attack, run missile(). To attack a ship, run attack(number) - use the number from the ship's name. To retreat, run retreat()`);
};
// PLAYER ATTACKS
function attack(x) {
    GoodGuy.player.attackAlien(x-1);
}
function attackAlien(index) {
    let target = Alien.alienShips[index];
    // sanity check - is the ship destroyed already?
    if (target.hull>0) {
        // Does the shot hit?
        if (Math.random()<this.accuracy) {
            if (this.useMissile) {
                target.hull-=this.firepower*2;
                this.useMissile=false;
            } else {
                target.hull-=this.firepower;
            };
            // is the alien ship destroyed?
            if (target.hull<=0) {
                console.log(`${this.name} destroyed ${target.name}!`);
                target.name+=` - DESTROYED`;
                target.hull=0;
                game.alienShipsDestroyed++;
                game.logAlienShips();
                if (game.alienShipsDestroyed<Alien.alienMax) {
                    console.log(`To load a missile for your next attack, run missile(). To attack another ship, run attack(number) - use the number from the ship's name. To retreat, run retreat()`);
                };
            } else {
                console.log(`${this.name} attacked ${target.name} for ${this.firepower} damage.`);
                randomAlienAttack();
            };
        } else {
            console.log(`${this.name} missed!`);
            randomAlienAttack();
        };
    } else {
        console.log(`That ship is already destroyed. You missed your chance and now an alien ship is attacking you!`);
        randomAlienAttack();
    };
    if (game.alienShipsDestroyed>=Alien.alienMax) {
        endGame();
    };

};
// ALIEN ATTACK
function alienAttack(target) {
    if (target.hull>0) {
        target.hull -= this.firepower;
        console.log(`${this.name} attacked ${target.name} for ${this.firepower} damage!`);
        if (Math.random()<.5) {
            target.shields(this.firepower);
        }
    };
}
// returns a random index for an existing alien ship
function randomAlienAttack() {
    // possibleAliens is an array consisting of indexes of existing aliens
    let possibleAliens=[];
    Alien.alienShips.forEach((element,index) => {
        if (element.hull>0) {
            possibleAliens.push(index);
        };
    });
    // Number is how many aliens should attack
    let number = Math.ceil(Math.random()*possibleAliens.length);
    for (let i=0; i<number; i++) {
        randomIndex = possibleAliens[Math.floor(Math.random()*possibleAliens.length)]
        Alien.alienShips[randomIndex].alienAttack(GoodGuy.player);
    };
    if (GoodGuy.player.hull<=0) {
        endGame();
    } else {
        game.displayStats();
        game.logAlienShips();
        console.log(`To load a missile for your next attack, run missile(). To attack another ship, run attack(number) - use the number from the ship's name.`);
    };
}
// END GAME FUNCTIONS
function endGame() {
    if (game.alienShipsDestroyed>=Alien.alienMax) {
        console.log(`${GoodGuy.player.name} destroyed all the alien ships! Huzzah!`);
    } else {
        console.log(`${GoodGuy.player.name} was destroyed. All hail the aliens.`);
    }
};
function retreat() {
    console.log(`You decided to retreat. All hail the aliens.`)
};
// BONUS FUNCTIONS
function shields(x) {
    if (this.hull<20) {
        this.hull += Math.ceil(Math.random()*x);
        console.log(`Your shields blocked some of the damage. Your current hull strength is ${this.hull}.`);
    };
};
function missile() {
    if (GoodGuy.player.missileNum>0) {
        GoodGuy.player.useMissile=true;
        GoodGuy.player.missileNum--;
        console.log(`Missle loaded. Run attack(number) to attack for 2x firepower!`)
    } else {
        console.log(`Oh no - you're out of missiles!`)
    };
}
// SET UP INSTRUCTIONS
console.log(`To create your ship and start the game, run: new GoodGuy("YOUR SHIP NAME")`);




/////////////// VERSION 1 CODE ////////////////////////////////////////////////////////////
// function attack(target) {
//     if (Alien.alienShips[Alien.alienNum-1].hull>0) {
//         let winner;
//         if (Math.random() < this.accuracy) {
//             target.hull -= this.firepower;
//             if (target.hull<=0) {
//                 winner = this;
//                 console.log(`${this.name} destroyed ${target.name}!`);
//             } else {
//                 console.log(`${this.name} attacked ${target.name} for ${this.firepower} damage. ${target.name} has ${target.hull} hull strength remaining.`);
//             };
//         } else {
//             console.log(`${this.name} attacked ${target.name} but it missed!`);
//         };
//         if (this.hull>0 && target.hull>0) {
//             target.attack(this);
//         } else if (Alien.alienNum===Alien.alienMax || ussAssembly.hull<=0) {
//             endGame();
//         } else if (winner===ussAssembly) {
//             console.log(`You have the choice to attack another alien ship or retreat.
//             To attack, run newAlien()
//             To retreat, run retreat()`);
//         };
//     } else {
//         newAlien();
//     };
// };

// function newAlien() {
//     if (ussAssembly.hull<=0) {
//         endGame();
//     } else if (Alien.alienNum<Alien.alienMax) {
//         let ship = new Alien;
//         ussAssembly.attack(ship);
//     } else {
//         endGame();
//     };
// };
