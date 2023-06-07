import moves, { Move } from './moves.js';


const { tackle, vineWhip, intimidate, tranquility, escapeArtist, psychicBark, bite, cerberusMaul, earthquake, sliceAndDice, hardenedShell, flameThrower, incinerate, burn, waterCannon, clawsOfFury, evade, terrorize, avalanche } = moves;

class Monster {
  constructor(name, type, maxHp, moves) {
    this.name = name;
    this.type = type;
    this.maxHp = maxHp;
    this.currentHp = maxHp;
    this.moves = moves;
    this.fainted = false;
  }

  isFainted() {
    return this.currentHp <= 0;
  }
}

class Player {
  constructor(monsters, items, name) {
    this.monsters = monsters;
    this.items = items;
    this.currentMonster = this.activeMonster();
    this.name = name;
  }

  activeMonster() {
    for (let monster of this.monsters) {
      if (!monster.fainted) {
        this.currentMonster = monster;
        return monster;
      }
    }
    this.currentMonster = null;
    return null;
  }

  switchMonster(newMonster) {
    if (newMonster.fainted) {
      console.log("You can't switch to a fainted monster!");
    } else {
      this.currentMonster = newMonster;
      console.log(`Go, ${newMonster.name}!`);
    }
  }
}

class Item {
  constructor(name, effect) {
    this.name = name;
    this.effect = effect;
  }
}

class Battle {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.currentTurn = player1;
    this.opponent = player2;
  }

  switchTurn() {
    if (this.currentTurn === this.player1) {
      this.currentTurn = this.player2;
      this.opponent = this.player1;
    } else {
      this.currentTurn = this.player1;
      this.opponent = this.player2;
    }
  }

  activeMonster(player) {
    for (let monster of player.monsters) {
      if (!monster.fainted) {
        player.currentMonster = active;
        return monster;
      }
    }
    return null;
  }

  handleMove(move) {
    let activeMonster = this.opponent.currentMonster;
    let attackingMonster = this.currentTurn.currentMonster;
    activeMonster.currentHp -= move.power;
    if (this.currentTurn === this.player1) {
      updateHpBar("player2", activeMonster.currentHp, activeMonster.maxHp);
    } else {
      updateHpBar("player1", activeMonster.currentHp, activeMonster.maxHp);
    }
    console.log(`${attackingMonster.name} used ${move.name}!`)
    console.log(`${activeMonster.name} took ${move.power} damage!`)
    if (activeMonster.isFainted()) {
      console.log(`${activeMonster.name} fainted!`);
      activeMonster.fainted = true;
      if (this.opponent.activeMonster() === null) {
        winner = this.currentTurn.name;
      } else {
        this.opponent.activeMonster();
        if (this.opponent === this.player1) {
          switchImage(this.opponent.currentMonster.name, "player1");
        } else {
          switchImage(this.opponent.currentMonster.name, "player2");
        }
        let activeMonster = this.opponent.currentMonster;
        if (this.currentTurn === this.player1) {
          updateHpBar("player1", activeMonster.currentHp, activeMonster.maxHp);
        } else {
          updateHpBar("player2", activeMonster.currentHp, activeMonster.maxHp);
        }
      }
    }
  }

  handleSwitch(monster) {
    if (monster.isFainted()) {
      console.log("You can't switch to a fainted monster!");
    } else if (monster === this.currentTurn.currentMonster) {
      console.log(`${monster.name} is your current monster!`);
    } else {
      console.log(`Go, ${monster.name}!`);
      this.currentTurn.currentMonster = monster
      if (this.currentTurn === this.player1) {
        switchImage(monster.name, "player1");
      } else {
        switchImage(monster.name, "player2");
      }
      if (!this.isBattleOver()) {
        opponentMove();
      }
      this.run();
    }
  }

  handleAction(action) {
    if (action instanceof Move) {
      this.handleMove(action);
    } else if (action instanceof Monster) {
      this.currentTurn.switchMonster(action);
    }
  }

  useItem(item, monster) {
    if (monster.fainted && item.effect === 0) {
      console.log(`${monster.name} is revived!`);
      monster.fainted = false;
      monster.currentHp = 100;
    } else if (!monster.fainted && item.effect > 0) {
      if (monster.currentHp + item.effect > monster.maxHp) {
        monster.currentHp = monster.maxHp
      } else {
        monster.currentHp += item.effect;
      }
      if (this.currentTurn === this.player1) {
        updateHpBar("player1", monster.currentHp, monster.maxHp);
      } else {
        updateHpBar("player2", monster.currentHp, monster.maxHp);
      }
      console.log(`${monster.name} gained ${item.effect} hit points and now has ${monster.currentHp} hit points!`);
    } else if (monster.fainted && item.effect > 0) {
      console.log(`You can't use this item on a fainted monster!`);
    } else if (!monster.fainted && item.effect === 0) {
      console.log(`You can't use this item on an active monster!`);
    }
    if (!this.isBattleOver()) {
      opponentMove();
    }
    this.run();
  }

  isBattleOver() {
    return this.player1.monsters.every(monster => monster.fainted) || this.player2.monsters.every(monster => monster.fainted);
  }

  run() {
    if (!this.isBattleOver()) {
      console.log(`Player 1's ${this.player1.currentMonster.name} HP: ${this.player1.currentMonster.currentHp}/${this.player1.currentMonster.maxHp}`)
      console.log(`Player 2's ${this.player2.currentMonster.name} HP: ${this.player2.currentMonster.currentHp}/${this.player2.currentMonster.maxHp}`)
      showMainMenu();
    } else {
    console.log(`${winner} wins!`);
    let victoryBanner = document.getElementById('game');
    victoryBanner.innerHTML = `<img src="YouWin.png">`;
    }
  }
}

// Get your button elements
let attackButton = document.getElementById('attack-button');
let switchButton = document.getElementById('switch-button');
let itemButton = document.getElementById('item-button');
let fleeButton = document.getElementById('flee-button');

// // Get your menus
// let mainMenu = document.getElementById('main-menu');
// let attackMenu = document.getElementById('attack-menu');
// let switchMenu = document.getElementById('switch-menu');
// let itemMenu = document.getElementById('item-menu');


function showMainMenu() {
    const mainMenu = document.getElementById('main-menu');
    mainMenu.innerHTML = `
        <button id="attack-button">Attack</button>
        <button id="switch-button">Switch</button>
        <button id="item-button">Item</button>
        <button id="flee-button">Flee</button>
    `;
    const attackButton = document.getElementById('attack-button');
    attackButton.addEventListener('click', showAttackMenu);
    const switchButton = document.getElementById('switch-button');
    switchButton.addEventListener('click', showSwitchMenu);
    const itemButton = document.getElementById('item-button');
    itemButton.addEventListener('click', showItemMenu);
    const fleeButton = document.getElementById('flee-button');
    fleeButton.addEventListener('click', showFleeMenu);
}

function showAttackMenu() {
    const attackMenu = document.getElementById('main-menu');
    const attacks = battle.currentTurn.currentMonster.moves;
    // Clear out the existing menu
    attackMenu.innerHTML = '';
    // For each attack, create a button, add the onclick, and append it to the menu
    attacks.forEach(attack => {
        let attackButton = document.createElement('button');
        attackButton.innerText = attack.name;
        attackButton.onclick = function() {
            handleAttack(attack);
        };
        attackMenu.appendChild(attackButton);
    });
    let backButton = document.createElement('button');
    backButton.innerText = "Back";
    backButton.onclick = function() {
      showMainMenu();
    }
    attackMenu.appendChild(backButton);
}

function showSwitchMenu() {
    const switchMenu = document.getElementById('main-menu');
    const switchOptions = battle.currentTurn.monsters;
    // Clear out the existing menu
    switchMenu.innerHTML = '';
    // For each attack, create a button, add the onclick, and append it to the menu
    switchOptions.forEach(option => {
        let switchButton = document.createElement('button');
        switchButton.innerText = option.name;
        switchButton.onclick = function() {
            battle.handleSwitch(option);
        };
        switchMenu.appendChild(switchButton);
    });
    let backButton = document.createElement('button');
    backButton.innerText = "Back";
    backButton.onclick = function() {
      showMainMenu();
    }
    switchMenu.appendChild(backButton);
}

function showItemEffectMenu(item) {
    const itemEffectMenu = document.getElementById('main-menu');
    const itemEffectOptions = battle.currentTurn.monsters;
    // Clear out the existing menu
    itemEffectMenu.innerHTML = '';
    // For each monster, create a button, add the onclick, and append it to the menu
    itemEffectOptions.forEach(option => {
        let itemEffectButton = document.createElement('button');
        itemEffectButton.innerText = option.name;
        itemEffectButton.onclick = function() {
            battle.useItem(item, option);
        };
        itemEffectMenu.appendChild(itemEffectButton);
    });
    let backButton = document.createElement('button');
    backButton.innerText = "Back";
    backButton.onclick = function() {
      showItemMenu()
    }
    itemEffectMenu.appendChild(backButton);
}

function showItemMenu() {
    const itemMenu = document.getElementById('main-menu');
    const itemOptions = battle.currentTurn.items;
    itemMenu.innerHTML = '';
    itemOptions.forEach(option => {
      let itemButton = document.createElement('button');
      itemButton.innerText = option.name;
      itemButton.onclick = function() {
        showItemEffectMenu(option);
      };
      itemMenu.appendChild(itemButton);
    });
    let backButton = document.createElement('button');
    backButton.innerText = "Back";
    backButton.onclick = function() {
      showMainMenu();
    }
    itemMenu.appendChild(backButton);
}

function showFleeMenu() {
  const fleeMenu = document.getElementById('main-menu');
  fleeMenu.innerHTML = '';
  console.log("Are you sure you want to run away?")
  let fleeButton = document.createElement('button');
  fleeButton.innerText = "Flee";
  fleeButton.onclick = function() {
    flee();
  }
  fleeMenu.appendChild(fleeButton);
  let backButton = document.createElement('button');
  backButton.innerText = "Back";
  backButton.onclick = function() {
    showMainMenu();
  }
  fleeMenu.appendChild(backButton);
}

function flee() {
  console.log(`${battle.opponent.name} wins!`);
  let fleeBanner = document.getElementById('game');
  fleeBanner.innerHTML = `<img src="GameOver.png">`;
}

function handleAttack(move) {
    battle.handleAction(move);
    opponentMove();
    battle.run();
}

function switchImage(newImageSrc, playerNumber) {
    let currentPlayer = playerNumber
    let monsterImage = document.getElementById(`${currentPlayer}-monster`);
    let monsterName = document.getElementById(`${currentPlayer}-monster-name`);
    monsterImage.src = `${newImageSrc}.png`;
    monsterName.innerText = newImageSrc;
}

function updateHpBar(player, currentHp, maxHp) {
    let currentPlayer = player
    let progressBar = document.getElementById(`hp-bar-${currentPlayer}`);
    let hpPercentage = (currentHp / maxHp) * 100;
    progressBar.value = hpPercentage;
    console.log("HPBAR UPDATED:" + hpPercentage)
}

function opponentMove() {
    if (!battle.isBattleOver()) {
        wait(1000);
        console.log(`It's ${battle.opponent.name}'s turn!`)
        battle.switchTurn()
        let movesNumber = battle.currentTurn.currentMonster.moves.length
        battle.handleMove(battle.currentTurn.currentMonster.moves[Math.floor(Math.random() * movesNumber)])
        battle.switchTurn()
    }
}

var wait = (ms) => {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
      now = Date.now();
    }
}
// // Function to generate the attack menu
// function generateAttackMenu(currentMonster) {
//     // Get your attack menu
//     let attackMenu = document.getElementById('menu');

//     // Get the current monster's moves
//     let moves = currentMonster.moves;  // Replace this with actual logic

//     // Empty the attackMenu first
//     while (attackMenu.firstChild) {
//         attackMenu.firstChild.remove();
//     }

//     // Add a button for each move
//     for (let move of moves) {
//         let moveButton = document.createElement('button');
//         moveButton.textContent = move.name;
//         moveButton.addEventListener('click', function() {
//             battle.handleMove(move);
//             attackMenu.style.display = "none";
//             mainMenu.style.display = "flex";
//         });
//         attackMenu.appendChild(moveButton);
//     }
// }

// // When the attack button is clicked, generate the attack menu and hide the main menu
// document.getElementById('attack-button').addEventListener('click', function() {
//     // Replace "currentMonster" with the actual current monster of the player
//     generateAttackMenu(currentMonster); 
//     mainMenu.style.display = "none";
//     attackMenu.style.display = "flex";
// });

let battle = null;
let winner = null;

function main() {

    // Let's create some monsters
    let bulbadon = new Monster("Bulbadon", "Grass", 200, [tackle, vineWhip, tranquility]);
    let charagon = new Monster("Charagon", "Fire", 250, [flameThrower, incinerate, hardenedShell]);
    let houndini = new Monster("Houndini", "Psychic", 200, [bite, escapeArtist, cerberusMaul]);
    let terraptor = new Monster("Terraptor", "Earth", 300, [sliceAndDice, earthquake, hardenedShell]);
    let falcocean = new Monster("Falcocean", "Water", 150, [waterCannon, clawsOfFury, evade]);
    let quartzion = new Monster("Quartzion", "Rock", 200, [avalanche, sliceAndDice, terrorize]);

    // And items
    let potion = new Item("Potion", 100);
    let superPotion = new Item("Super Potion", 250);
    let smellingSalts = new Item("Smelling Salts", 0);

    // And players
    let player1 = new Player([bulbadon, houndini, terraptor], [potion, superPotion, smellingSalts], "Aki");
    let player2 = new Player([charagon, falcocean, quartzion], [potion, superPotion, smellingSalts], "Vincent");

    // And a battle
    battle = new Battle(player1, player2);
    
    setTimeout(() => {
        battle.run();
    }, 0);
}

window.onload = main;  // To kick-off the game.