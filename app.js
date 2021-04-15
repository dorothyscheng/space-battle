const header=$(".header");
const headerTitle=$(".title");
const main=$(".main");
const startForm = $(".start-form");
const startButton = $(".start-button");
const shipName = $("#ship-name");
const playerSection=$(".player-section");
const alienSection=$(".alien-section");
const alienShipsDiv=$(".alien-ships-div");
const playerShipName=$(".ship-name");
const playerMissile=$(".missile-text");
const playerHull=$(".hull-text");
const playerAccuracy=$(".accuracy-text");
const playerFire=$(".firepower-text");
const shieldText=$(".shield-text");
const playerTitle=$(".player-title");
const gameMessage=$(".game-message");
const missileButton=$(".missile-button");
const retreatButton=$(".retreat");

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
        this.missileNum = 0;
        this.useMissile=false;
        GoodGuy.player=this;
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
    player: {},
    updateStats: function updateStats() {
        playerHull.text(this.player.hull);
        playerAccuracy.text(this.player.accuracy);
        playerFire.text(this.player.firepower);
        playerMissile.text(this.player.missileNum);
    },
};
function startGame() {
    let player=GoodGuy.player;
    player.missileNum = Math.ceil(Math.random()*Alien.alienMax);
    game.player=player;
    // startForm.fadeOut();
    playerShipName.text(player.name);
    game.updateStats();
    main.css("height","100vh");
    header.css("justify-self","flex-start");
    header.css("margin-top","20px");
    header.fadeIn();
    playerSection.fadeIn();
    alienSection.fadeIn();    
    playerSection.css("display","flex");
    alienSection.css("display","flex");
    for (let i=0; i<Alien.alienMax; i++) {
        new Alien;
        let alien=$('<i class="fas fa-meteor"></i>');
        alien.toggleClass(`alien${i}`);
        alien.appendTo(alienShipsDiv);
        alien.on("click",targetAlien);
    };
    gameMessage.text(`You see ${Alien.alienMax} alien ships coming at ${GoodGuy.player.name}! Click a ship to attack it.`);
    gameMessage.fadeIn();
    missileButton.on("click",missile);
    playerTitle.text(`Missiles increase your firepower 2x - but you have a limited number!`);
};
// PLAYER ATTACKS
// manages click events and calls player attackAlien
function targetAlien() {
    $(".fa-meteor").off("click",targetAlien);
    let index=parseInt(this.className.charAt(19));
    GoodGuy.player.attackAlien(index);
}
function attackAlien(index) {
    let target = Alien.alienShips[index];
    missileButton.attr("data-state","not-selected");
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
                gameMessage.text(`You destroyed ${target.name}! Attack again or retreat?`);
                missileButton.on("click",missile);
                $(".fa-meteor").on("click",targetAlien);
                target.hull=0;
                game.alienShipsDestroyed++;
                if (game.alienShipsDestroyed<Alien.alienMax) {
                    retreatButton.on("click",retreat);
                    retreatButton.css("opacity","1");
                    retreatButton.css("cursor","pointer");
                    let destroyedShip = $(".fa-meteor").eq(index);
                    destroyedShip.toggleClass("destroyed");
                };
            } else {
                gameMessage.text(`You did ${this.firepower} damage to ${target.name}. Now the aliens are firing back!`);
                // I'm not convinced these timeouts are working as intended...
                setTimeout(randomAlienAttack(),3000);
            };
        } else {
            gameMessage.text(`You missed. Now the aliens are firing back!`);
            this.useMissile=false;
            setTimeout(randomAlienAttack(),3000);
        };
    } else {
        gameMessage.text(`That ship is already destroyed. Now the aliens are firing back!`);
        this.useMissile=false;
        setTimeout(randomAlienAttack(),3000);
    };
    if (game.alienShipsDestroyed>=Alien.alienMax) {
        endGame();
    };

};
// ALIEN ATTACK
// individual alien attacks called by randomAlienAttack
function alienAttack(target) {
    if (Math.random() < this.accuracy) {
        if (target.hull>0) {
            target.hull -= this.firepower;
            target.shields(this.firepower);
        };
    };
}
// runs attacks from a random number of alien ships
function randomAlienAttack() {
    retreatButton.off();
    retreatButton.css("opacity","0");
    retreatButton.css("cursor","default");
    // possibleAliens is an array consisting of indexes of existing aliens
    let possibleAliens=[];
    Alien.alienShips.forEach((element,index) => {
        if (element.hull>0) {
            possibleAliens.push(index);
        };
    });
    // Number is how many aliens should attack
    let number = Math.ceil(Math.random()*possibleAliens.length);
    let attackers=[];
    for (let i=0; i<number; i++) {
        let randomIndex = possibleAliens[Math.floor(Math.random()*possibleAliens.length)]
        attackers.push(randomIndex);
        Alien.alienShips[randomIndex].alienAttack(GoodGuy.player);
        $(`.alien${randomIndex}`).attr("data-state","attacking");
    };
    if (GoodGuy.player.hull<=0) {
        endGame();
    } else {
        setTimeout(function() {
            attackers.forEach(element => {
                let attackerEl = $(`.alien${element}`);
                attackerEl.attr("data-state","neutral");
            });
        },2500);
        setTimeout(function () {
            gameMessage.text(`Hull strength at ${GoodGuy.player.hull}. Select a ship for your next attack.`);
            $(`.fa-meteor`).on("click",targetAlien);
            game.updateStats();
            missileButton.on("click",missile);
        },3000);
    };
}
// END GAME FUNCTIONS
function endGame() {
    alienSection.fadeOut();
    playerSection.fadeOut();
    gameMessage.fadeOut();
    alienShipsDiv.empty();
    startButton.text('Play again?');
    shipName.val('Your Ship Name');
    startForm.fadeIn();
    if (game.alienShipsDestroyed>=Alien.alienMax) {
        gameMessage.text(`${GoodGuy.player.name} destroyed all the alien ships! Huzzah!`);
        gameMessage.fadeIn();
        game.alienShipsDestroyed=0;
    } else {
        gameMessage.text(`${GoodGuy.player.name} was destroyed. All hail the aliens.`);
        gameMessage.fadeIn();
        game.alienShipsDestroyed=0;
    };

};
function retreat() {
    main.hide();
    headerTitle.text("You decided to retreat. All hail the aliens.");
};
// BONUS FUNCTIONS
function shields(x) {
    if (this.hull<20) {
        this.hull += Math.ceil(Math.random()*x);
        shieldText.attr("data-state","active");
        setTimeout(function() {
            shieldText.attr("data-state","not-active");
        },3000);
    };
};
// This kept firing multiple times so added a conditional check...but still not sure why it doesn't work without that.
function missile() {
    missileButton.off();
    if (!GoodGuy.player.useMissile) {
        if (GoodGuy.player.missileNum>0) {
            GoodGuy.player.useMissile=true;
            GoodGuy.player.missileNum--;
            missileButton.attr("data-state","selected");
            game.updateStats();
        } else {
            gameMessage.text(`No missiles remaining.`);
            setTimeout(function() {
                gameMessage.text('Select a ship for your next attack.');
            },1500);
        };
    };
};
// EVENT LISTENERS
shipName.on("click",function () {
    $(this).val("");
});
startButton.on("click", e => {
    e.preventDefault();
    if ($('#end-message')) {
        $('#end-message').remove();
    };
    if(shipName.val().trim() !== "") {
        startForm.fadeOut();
        header.fadeOut();
        gameMessage.fadeOut();
        setTimeout(function() {
            let namePlayer = shipName.val().trim();
            new GoodGuy(namePlayer);
        },1000);
    };
});