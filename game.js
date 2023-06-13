import moves, { Move, Targets } from "./moves.js";

const {
  tackle,
  vineWhip,
  intimidate,
  tranquility,
  escapeArtist,
  psychicBark,
  bite,
  cerberusMaul,
  earthquake,
  sliceAndDice,
  hardenedShell,
  flameThrower,
  incinerate,
  burn,
  waterCannon,
  clawsOfFury,
  evade,
  terrorize,
  avalanche,
} = moves;

class Monster {
  constructor(name, type, maxHp, offense, defense, moves) {
    this.name = name;
    this.type = type;
    this.maxHp = maxHp;
    this.currentHp = maxHp;
    this.moves = moves;
    this.fainted = false;
    this.defense = defense;
    this.offense = offense;
  }

  isFainted() {
    return this.currentHp <= 0;
  }

  takeDamage(damage, attackingMonster) {
    let damageTaken = 0;
    if (damage - this.defense + attackingMonster.offense > 0) {
      damageTaken = damage - this.defense + attackingMonster.offense;
    }
    if (this.currentHp - damageTaken < 0) {
      this.currentHp = 0;
    } else {
      this.currentHp -= damageTaken;
    }
    return damageTaken;
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
      displayMessage("You can't switch to a fainted monster.");
    } else {
      this.currentMonster = newMonster;
      displayMessage(`Go, ${newMonster.name}!`);
    }
  }
}

class Item {
  constructor(name, effect, number) {
    this.name = name;
    this.effect = effect;
    this.number = number;
  }

  isRemaining() {
    return this.number > 0;
  }

  use() {
    if (this.isRemaining()) {
      this.number--;
    } else {
      return null;
    }
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

  async handleMove(move) {
    let activeMonster = this.opponent.currentMonster;
    let attackingMonster = this.currentTurn.currentMonster;
    displayMessage(`${attackingMonster.name} used ${move.name}.`);
    if (move.targets.includes(Targets.Self)) {
      if (move.affectsOffense) {
        attackingMonster.offense += move.power;
        displayMessage(`${attackingMonster.name}'s offense is increased by ${move.power}!`);
      }
      if (move.affectsDefense) {
        attackingMonster.defense += move.power;
        displayMessage(`${attackingMonster.name}'s defense is increased by ${move.power}!`);
      }
      if (move.affectsHp) {
        if (attackingMonster.currentHp + move.power > monster.maxHp) {
          attackingMonster.currentHp = monster.maxHp;
        } else {
          attackingMonster.currentHp += move.power;
        }
        if (this.currentTurn === this.player1) {
          updateHpBar("player1", monster.currentHp, monster.maxHp);
        } else {
          updateHpBar("player2", monster.currentHp, monster.maxHp);
        }
        displayMessage(
          `${attackingMonster.name} gained ${move.power} hit points and now has ${attackingMonster.currentHp} hit points!`
        );
      }
    }
    if (move.targets.includes(Targets.Allies)) {
      if (move.affectsOffense) {
        this.currentTurn.monsters.forEach((monster) => {
          monster.offense += move.power;
        })
        displayMessage(`All of ${this.currentTurn.name}'s monsters had their offense increased by ${move.power}!`);
      }
      if (move.affectsDefense) {
        this.currentTurn.monsters.forEach((monster) => {
          monster.defense += move.power;
        })
        displayMessage(`All of ${this.currentTurn.name}'s monsters had their defense increased by ${move.power}!`);
      }
      if (move.affectsHp) {
        this.currentTurn.monsters.forEach((monster) => {
          console.log("DOIN STUFF");
          if (monster.currentHp + move.power > monster.maxHp) {
            monster.currentHp = monster.maxHp;
          } else {
            monster.currentHp += move.power;
          }
        })
        console.log("YES???")
        if (this.currentTurn === this.player1) {
          updateHpBar("player1", this.currentTurn.currentMonster.currentHp, this.currentTurn.currentMonster.maxHp);
          console.log("UPDATIN");
        } else {
          updateHpBar("player2", this.currentTurn.currentMonster.currentHp, this.currentTurn.currentMonster.maxHp);
          console.log("UPDATIN ENEMY");
        }
        displayMessage(`All of ${this.currentTurn.name}'s monsters had their hit points healed by ${move.power}!`);
      }
    }
    if (move.targets.includes(Targets.Enemy)) {
      if (move.affectsOffense) {
        activeMonster.offense += move.power;
        displayMessage(`${activeMonster.name}'s offense is reduced by ${move.power}!`);
      }
      if (move.affectsDefense) {
        activeMonster.defense += move.power;
        displayMessage(`${activeMonster.name}'s defense is reduced by ${move.power}!`);
      }
      if (move.affectsHp) {
        let damageTaken = activeMonster.takeDamage(move.power, attackingMonster);
        displayMessage(`${activeMonster.name} took ${damageTaken} damage!`);
        if (this.opponent === this.player1) {
          await updateHpBar(
            "player1",
            activeMonster.currentHp,
            activeMonster.maxHp
          );
        } else {
          await updateHpBar(
            "player2",
            activeMonster.currentHp,
            activeMonster.maxHp
          );
        }
        if (activeMonster.isFainted()) {
          displayMessage(`${activeMonster.name} fainted!`);
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
            if (this.opponent === this.player1) {
              await updateHpBar(
                "player1",
                this.opponent.currentMonster.currentHp,
                this.opponent.currentMonster.maxHp
              );
            } else {
              await updateHpBar(
                "player2",
                this.opponent.currentMonster.currentHp,
                this.opponent.currentMonster.maxHp
              );
            }
          } 
        }
      }
    }
    if (move.targets.includes(Targets.Enemies)) {
      if (move.affectsOffense) {
        this.opponent.monsters.forEach((monster) => {
          monster.offense += move.power;
        })
        displayMessage(`All of ${this.opponent.name}'s monsters had their offense decreased by ${move.power}!`);
      }
      if (move.affectsDefense) {
        this.opponent.monsters.forEach((monster) => {
          monster.defense += move.power;
        })
        displayMessage(`All of ${this.opponent.name}'s monsters had their defense decreased by ${move.power}!`);
      }
      if (move.affectsHp) {
        displayMessage(`All of ${this.opponent.name}'s monsters took damage!`);
        this.opponent.monsters.forEach((monster) => {
          if (!monster.fainted) {
            let damageTaken = monster.takeDamage(move.power, attackingMonster);
            console.log(`${monster.name} took ${damageTaken}!`)
            if (monster.isFainted()) {
              displayMessage(`${monster.name} fainted!`);
              monster.fainted = true;
              if (this.opponent.activeMonster() === null) {
                winner = this.currentTurn.name;
              } else {
                if (monster === this.opponent.currentMonster) {
                  if (this.opponent.currentMonster) {
                    if (this.opponent === this.player1) {
                      switchImage(this.opponent.currentMonster.name, "player1");
                    } else {
                      switchImage(this.opponent.currentMonster.name, "player2");
                    }
                  }
                }
              }
            }
            if (this.currentTurn === this.player1) {
              updateHpBar(
                "player2",
                activeMonster.currentHp,
                activeMonster.maxHp
              );
            } else {
              updateHpBar(
                "player1",
                activeMonster.currentHp,
                activeMonster.maxHp
              );
            }
          }
        }) 
      }
    }
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000)
    });
  }

  async handleSwitch(monster) {
    if (monster.isFainted()) {
      displayMessage("You can't switch to a fainted monster.");
    } else if (monster === this.currentTurn.currentMonster) {
      displayMessage(`${monster.name} is your current monster.`);
    } else {
      displayMessage(`Go, ${monster.name}!`);
      this.currentTurn.currentMonster = monster;
      if (this.currentTurn === this.player1) {
        switchImage(monster.name, "player1");
        await updateHpBar("player1", monster.currentHp, monster.maxHp);
      } else {
        switchImage(monster.name, "player2");
        await updateHpBar("player2", monster.currentHp, monster.maxHp);
      }
      if (!this.isBattleOver()) {
        await opponentMove();
      }
      this.run();
    }
  }

  async handleAction(action) {
    if (action instanceof Move) {
      console.log("WAITING for HANDLEMOVE")
      await this.handleMove(action);
      console.log("MOVE HANDLED")
    } else if (action instanceof Monster) {
      this.currentTurn.switchMonster(action);
    }
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 10)
    });
  }

  async useItem(item, monster) {
    if (monster.fainted && item.effect === 0) {
      displayMessage(`${this.currentTurn.name} used ${item.name} on ${monster.name}`)
      await sleep(2000);
      displayMessage(`${monster.name} is revived!`);
      monster.fainted = false;
      monster.currentHp = 100;
      await sleep(2000);
      if (!this.isBattleOver()) {
        await opponentMove();
      }
      this.run();
    } else if (!monster.fainted && item.effect > 0) {
      displayMessage(`${this.currentTurn.name} used ${item.name} on ${monster.name}`)
      if (monster.currentHp + item.effect > monster.maxHp) {
        monster.currentHp = monster.maxHp;
      } else {
        monster.currentHp += item.effect;
      }
      if (this.currentTurn.currentMonster === monster) {
        if (this.currentTurn === this.player1) {
          await updateHpBar("player1", monster.currentHp, monster.maxHp);
        } else {
          await updateHpBar("player2", monster.currentHp, monster.maxHp);
        }
      }
      displayMessage(
        `${monster.name} recovered health!`
      );
      await sleep(2000);
      if (!this.isBattleOver()) {
        await opponentMove();
      }
      this.run();
    } else if (monster.fainted && item.effect > 0) {
      displayMessage(`You can't use this item on a fainted monster.`);
    } else if (!monster.fainted && item.effect === 0) {
      displayMessage(`You can't use this item on an active monster.`);
    }
  }

  isBattleOver() {
      if (this.player1.monsters.every((monster) => monster.fainted)) {
        return 'player2'
      } else if (this.player2.monsters.every((monster) => monster.fainted)) {
        return 'player1'
      }
  }

  run() {
    if (!this.isBattleOver()) {
      console.log(
        `Player 1's ${this.player1.currentMonster.name} HP: ${this.player1.currentMonster.currentHp}/${this.player1.currentMonster.maxHp} Offense: ${this.player1.currentMonster.offense} Defense: ${this.player1.currentMonster.defense}`
      );
      console.log(
        `Player 2's ${this.player2.currentMonster.name} HP: ${this.player2.currentMonster.currentHp}/${this.player2.currentMonster.maxHp} Offense: ${this.player2.currentMonster.offense} Defense: ${this.player2.currentMonster.defense}`
      );
      showMainMenu();
    } else if (this.isBattleOver() === 'player1') {
      displayMessage(`${winner} wins!`);
      setTimeout(function() {
        let victoryBanner = document.getElementById("game");
        victoryBanner.innerHTML = `<img src="YouWin.png">`;
      }, 3000)
    } else if (this.isBattleOver() === 'player2') {
      displayMessage(`${winner} wins!`);
      setTimeout(function() {
        let lossBanner = document.getElementById("game");
        lossBanner.innerHTML = `<img src="GameOver.png">`;
      }, 3000)
    }
  }
}

// Get your button elements
let attackButton = document.getElementById("attack-button");
let switchButton = document.getElementById("switch-button");
let itemButton = document.getElementById("item-button");
let fleeButton = document.getElementById("flee-button");

function showMainMenu() {
  const mainMenu = document.getElementById("main-menu");
  mainMenu.innerHTML = `
        <button id="attack-button">Attack</button>
        <button id="switch-button">Switch</button>
        <button id="item-button">Item</button>
        <button id="flee-button">Flee</button>
    `;
  const attackButton = document.getElementById("attack-button");
  attackButton.addEventListener("click", showAttackMenu);
  const switchButton = document.getElementById("switch-button");
  switchButton.addEventListener("click", showSwitchMenu);
  const itemButton = document.getElementById("item-button");
  itemButton.addEventListener("click", showItemMenu);
  const fleeButton = document.getElementById("flee-button");
  fleeButton.addEventListener("click", showFleeMenu);
}

function showAttackMenu() {
  const attackMenu = document.getElementById("main-menu");
  const attacks = battle.currentTurn.currentMonster.moves;
  // Clear out the existing menu
  attackMenu.innerHTML = "";
  // Clear out existing buttons
  buttons = [];
  // For each attack, create a button, add the onclick, and append it to the menu
  attacks.forEach((attack) => {
    let attackButton = document.createElement("button");
    attackButton.innerText = `${attack.name}, ${attack.currentUsage}/${attack.maxUsage}`;
    attackButton.onclick = function () {
      if (attack.isUsable()) {
        attack.use();
        disableButtons();
        handleAttack(attack);
      } else {
        displayMessage("You can't use that move anymore.");
      }
    };
    attackMenu.appendChild(attackButton);
    buttons.push(attackButton);
  });
  let backButton = document.createElement("button");
  backButton.innerText = "Back";
  backButton.onclick = function () {
    showMainMenu();
  };
  attackMenu.appendChild(backButton);
  buttons.push(backButton);
}

function showSwitchMenu() {
  const switchMenu = document.getElementById("main-menu");
  const switchOptions = battle.currentTurn.monsters;
  // Clear out the existing menu
  switchMenu.innerHTML = "";
  buttons = [];
  // For each attack, create a button, add the onclick, and append it to the menu
  switchOptions.forEach((option) => {
    let switchButton = document.createElement("button");
    switchButton.innerText = option.name;
    switchButton.onclick = function () {
      disableButtons();
      battle.handleSwitch(option);
    };
    switchMenu.appendChild(switchButton);
    buttons.push(switchButton);
  });
  let backButton = document.createElement("button");
  backButton.innerText = "Back";
  backButton.onclick = function () {
    showMainMenu();
  };
  switchMenu.appendChild(backButton);
  buttons.push(backButton);
}

function showItemEffectMenu(item) {
  const itemEffectMenu = document.getElementById("main-menu");
  const itemEffectOptions = battle.currentTurn.monsters;
  // Clear out the existing menu
  itemEffectMenu.innerHTML = "";
  buttons = [];
  // For each monster, create a button, add the onclick, and append it to the menu
  itemEffectOptions.forEach((option) => {
    let itemEffectButton = document.createElement("button");
    itemEffectButton.innerText = option.name;
    itemEffectButton.onclick = function () {
      disableButtons();
      battle.useItem(item, option);
    };
    itemEffectMenu.appendChild(itemEffectButton);
    buttons.push(itemEffectButton);
  });
  let backButton = document.createElement("button");
  backButton.innerText = "Back";
  backButton.onclick = function () {
    showItemMenu();
  };
  itemEffectMenu.appendChild(backButton);
  buttons.push(backButton);
}

function showItemMenu() {
  const itemMenu = document.getElementById("main-menu");
  const itemOptions = battle.currentTurn.items;
  itemMenu.innerHTML = "";
  itemOptions.forEach((option) => {
    let itemButton = document.createElement("button");
    itemButton.innerText = `${option.name}, ${option.number}`;
    itemButton.onclick = function () {
      if (option.isRemaining()) {
        option.use();
        showItemEffectMenu(option);
      } else {
        displayMessage("You don't have any more of that item.");
      }
    };
    itemMenu.appendChild(itemButton);
  });
  let backButton = document.createElement("button");
  backButton.innerText = "Back";
  backButton.onclick = function () {
    showMainMenu();
  };
  itemMenu.appendChild(backButton);
}

function showFleeMenu() {
  const fleeMenu = document.getElementById("main-menu");
  fleeMenu.innerHTML = "";
  displayMessage("Are you sure you want to run away?");
  let fleeButton = document.createElement("button");
  fleeButton.innerText = "Flee";
  fleeButton.onclick = function () {
    flee();
  };
  fleeMenu.appendChild(fleeButton);
  let backButton = document.createElement("button");
  backButton.innerText = "Back";
  backButton.onclick = function () {
    showMainMenu();
  };
  fleeMenu.appendChild(backButton);
}

function disableMenu() {
  const menu = document.getElementById("main-menu");

}

function flee() {
  displayMessage(`${battle.opponent.name} wins!`);
  let fleeBanner = document.getElementById("game");
  fleeBanner.innerHTML = `<img src="GameOver.png">`;
}

function displayMessage(message) {
  let battleLog1 = document.getElementById('battle-log1');
  let battleLog2 = document.getElementById('battle-log2');
  let battleLog3 = document.getElementById('battle-log3');
  let battleLog4 = document.getElementById('battle-log4');
  battleLog4.innerText = battleLog3.innerText;
  battleLog3.innerText = battleLog2.innerText;
  battleLog2.innerText = battleLog1.innerText;
  battleLog1.innerText = message;
}

async function handleAttack(move) {
  await battle.handleAction(move);
  await opponentMove();
  battle.run();
}

function switchImage(newImageSrc, playerNumber) {
  let currentPlayer = playerNumber;
  let monsterImage = document.getElementById(`${currentPlayer}-monster`);
  let monsterName = document.getElementById(`${currentPlayer}-monster-name`);
  monsterImage.src = `${newImageSrc}.png`;
  monsterName.innerText = newImageSrc;
}

function updateHpBar(player, currentHp, maxHp) {
  let currentPlayer = player;
  let progressBar = document.getElementById(`hp-bar-${currentPlayer}`);
  let hpPercentage = (currentHp / maxHp) * 100;
  progressBar.style.width = `${hpPercentage}%`;
  console.log("HPBAR UPDATED:" + hpPercentage);

  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1500)
  });
}

async function opponentMove() {
  console.log("It's the opponent's turn!");
  if (!battle.isBattleOver()) {
    console.log(`It's ${battle.opponent.name}'s turn!`);
    battle.switchTurn();
    let movesNumber = battle.currentTurn.currentMonster.moves.length;
    let move =
      battle.currentTurn.currentMonster.moves[
        Math.floor(Math.random() * movesNumber)
      ];
    console.log(`Opponent is using ${move.name}!`);
    await battle.handleMove(move);
    console.log("ABOUT TO SWITCH TURN")
    battle.switchTurn();
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000); // same duration as your transition
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function disableButtons() {
  buttons.forEach(button => button.disabled = true);
}

function enableButtons() {
  buttons.forEach(button => button.disabled = false);
}

function startGame() {
  document.getElementById("start-button").addEventListener("click", function() {
    document.getElementById("overlay").style.display = "none";
    music.loop = true;
    music.play();
  });
}

document.getElementById("toggle-music").addEventListener("click", function() {
    if(music.paused) {
        music.play();
    } else {
        music.pause();
    }
});

document.getElementById("volume-slider").addEventListener("input", function() {
    music.volume = this.value;
});

let music = new Audio('battle-music.wav');

let battle = null;
let winner = null;
let buttons = [];

function main() {
  startGame();
  // Let's create some monsters
  let bulbadon = new Monster("Bulbadon", "Grass", 200, 50, 50, [
    intimidate,
    vineWhip,
    tranquility,
  ]);
  let charagon = new Monster("Charagon", "Fire", 250, 75, 25, [
    flameThrower,
    incinerate,
    hardenedShell,
  ]);
  let houndini = new Monster("Houndini", "Psychic", 200, 50, 50, [
    bite,
    escapeArtist,
    cerberusMaul,
  ]);
  let terraptor = new Monster("Terraptor", "Earth", 300, 75, 50, [
    sliceAndDice,
    earthquake,
    hardenedShell,
  ]);
  let falcocean = new Monster("Falcocean", "Water", 150, 100, 25, [
    waterCannon,
    clawsOfFury,
    evade,
  ]);
  let quartzion = new Monster("Quartzion", "Rock", 200, 25, 75, [
    avalanche,
    sliceAndDice,
    terrorize,
  ]);

  // And items
  let potion = new Item("Potion", 100, 5);
  let superPotion = new Item("Super Potion", 250, 3);
  let smellingSalts = new Item("Smelling Salts", 0, 2);

  // And players
  let player1 = new Player(
    [bulbadon, houndini, terraptor],
    [potion, superPotion, smellingSalts],
    "Aki"
  );
  let player2 = new Player(
    [charagon, falcocean, quartzion],
    [potion, superPotion, smellingSalts],
    "Vincent"
  );

  // And a battle
  battle = new Battle(player1, player2);

  setTimeout(() => {
    battle.run();
  }, 0);
}

window.onload = main; // To kick-off the game.
