import moves, { Move, Targets } from "./moves.js";

let hoverSound = new Audio('retro_UI_hover.wav');
let clickSound = new Audio('retro_UI_select.wav');
let attackSound = new Audio('retro_impact_hit_13.wav');
let music = new Audio('battle-music.wav');
let battle = null;
let winner = null;
let buttons = [];
let normalButton = "StraightButton.png";
let hoverButton = "ButtonHover.png";
let clickButton = "ButtonClicked.png";
let disabledButton = "ButtonDisabled.png";

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


class Button {
  constructor(text, hoverImage, clickImage, normalImage, mouseoverSound, clickSound, action, updateTextFunction) {
    this.element = document.createElement("div");
    this.element.className = 'actions';

    this.imageElement = document.createElement('img');
    this.imageElement.src = normalImage;
    this.element.appendChild(this.imageElement);

    this.textElement = document.createElement('span'); // changed this line
    this.textElement.innerText = text;
    this.element.appendChild(this.textElement);

    this.updateTextFunction = updateTextFunction;
    this.action = action;

    this.element.addEventListener("mouseover", function() {
      if (!this.disabled) {
        mouseoverSound.play();
        this.imageElement.src = hoverImage;
      }
    }.bind(this));

    this.element.addEventListener("mouseout", function() {
      if (!this.disabled) {
        this.imageElement.src = normalImage;
      }
    }.bind(this));

    this.element.addEventListener("click", async function () {
      if (!this.disabled) {
        clickSound.play();
        this.imageElement.src = clickImage;
        await sleep(200);
        this.imageElement.src = normalImage;
        this.action();
      }
    }.bind(this));

    this.disabled = false;
  }

  disable() {
    this.disabled = true;
    this.imageElement.src = disabledButton; // Set the source to a disabled button image
  }

  enable() {
    this.disabled = false;
    this.imageElement.children[0].src = normalButton; // Reset the source to the normal button image
  }

  updateText() {
    if (this.updateTextFunction) {
      this.textElement.innerText = this.updateTextFunction();
    }
  }
}

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
          if (monster.currentHp + move.power > monster.maxHp) {
            monster.currentHp = monster.maxHp;
          } else {
            monster.currentHp += move.power;
          }
        })
        if (this.currentTurn === this.player1) {
          updateHpBar("player1", this.currentTurn.currentMonster.currentHp, this.currentTurn.currentMonster.maxHp);
        } else {
          updateHpBar("player2", this.currentTurn.currentMonster.currentHp, this.currentTurn.currentMonster.maxHp);
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
            console.log("Current active now:" + this.opponent.currentMonster.name)
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
        for (const monster of this.opponent.monsters) {
          if (!monster.fainted) {
            let damageTaken = monster.takeDamage(move.power, attackingMonster);
            console.log(`${monster.name} took ${damageTaken}!`)
            if (this.opponent.currentMonster === monster) {
              if (this.opponent === this.player1) {
                await updateHpBar(
                  "player1",
                  monster.currentHp,
                  monster.maxHp
                );
              } else {
                await updateHpBar(
                  "player2",
                  monster.currentHp,
                  monster.maxHp
                );
              }
            }
            if (monster.isFainted()) {
              displayMessage(`${monster.name} fainted!`);
              monster.fainted = true;
              if (this.opponent.activeMonster() === null) {
                winner = this.currentTurn.name;
              } else {
                if (this.opponent === this.player1) {
                  switchImage(this.opponent.currentMonster.name, "player1");
                  await updateHpBar(
                    "player1",
                    this.opponent.currentMonster.currentHp,
                    this.opponent.currentMonster.maxHp
                  );
                } else {
                  switchImage(this.opponent.currentMonster.name, "player2");
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
      disableButtons();
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
      disableButtons()
      displayMessage(`${this.currentTurn.name} used ${item.name} on ${monster.name}`)
      await sleep(2000);
      displayMessage(`${monster.name} is revived!`);
      monster.fainted = false;
      monster.currentHp = 100;
      await sleep(2000);
      if (!this.isBattleOver()) {
        await opponentMove();
      }
      item.use();
      this.run();
    } else if (!monster.fainted && item.effect > 0) {
      disableButtons()
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
      item.use();
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

function setupButton(buttonId, callback) {
  const button = document.getElementById(buttonId);
  
  button.addEventListener("mouseover", function() {
    this.children[0].src = hoverButton; // Change the image to hoverImage when the mouse hovers over the button
    hoverSound.play();
  });

  button.addEventListener("mouseout", function() {
    this.children[0].src = normalButton; // Change the image back to normalImage when the mouse leaves the button
  });

  button.addEventListener("click", async function() {
    this.children[0].src = clickButton; // Change the image to clickImage when the button is clicked
    await sleep(200);
    callback();
  });
}

function showMainMenu() {
  const mainMenu = document.getElementById("main-menu");
  mainMenu.innerHTML = `
        <div id="attack-button">
          <img src="StraightButton.png" alt="Attack">
          <span>Attack</span>
        </div>
        <div id="switch-button">
          <img src="StraightButton.png" alt="Switch">
          <span>Switch</span>
        </div>
        <div id="item-button">
          <img src="StraightButton.png" alt="Item">
          <span>Item</span>
        </div>
        <div id="flee-button">
          <img src="StraightButton.png" alt="Flee">
          <span>Flee</span>
        </div>
    `;
  setupButton("attack-button", showAttackMenu);
  setupButton("switch-button", showSwitchMenu);
  setupButton("item-button", showItemMenu);
  setupButton("flee-button", showFleeMenu);
}

function showAttackMenu() {
  clickSound.play()
  const attackMenu = document.getElementById("main-menu");
  const attacks = battle.currentTurn.currentMonster.moves;
  // Clear out the existing menu
  attackMenu.innerHTML = "";
  // Clear out existing buttons
  buttons = [];
  // For each attack, create a button, add the onclick, and append it to the menu
  attacks.forEach((attack) => {
    let attackButton = new Button(`${attack.name}, ${attack.currentUsage}/${attack.maxUsage}`, hoverButton, clickButton, normalButton, hoverSound, attackSound, function() {
      console.log("IS USABLE?" + attack.isUsable());
      if (attack.isUsable()) {
        console.log("USING");
        attack.use();
        buttons.forEach(button => button.updateText());
        disableButtons();
        console.log("USING");
        handleAttack(attack);
      } else {
        displayMessage("You can't use that move anymore.");
      }
    },
    function() {
      return `${attack.name}, ${attack.currentUsage}/${attack.maxUsage}`;
    })
    attackMenu.appendChild(attackButton.element);
    buttons.push(attackButton);
  });
  let backButton = new Button("Back", hoverButton, clickButton, normalButton, hoverSound, clickSound, showMainMenu);
  attackMenu.appendChild(backButton.element);
  buttons.push(backButton);
  buttons.forEach(button => console.log(button.element));
}

function showSwitchMenu() {
  clickSound.play();
  const switchMenu = document.getElementById("main-menu");
  const switchOptions = battle.currentTurn.monsters;
  // Clear out the existing menu
  switchMenu.innerHTML = "";
  buttons = [];
  // For each attack, create a button, add the onclick, and append it to the menu
  switchOptions.forEach(async (option) => {
    let switchButton = new Button(`${option.name} ${option.currentHp}/${option.maxHp}`, hoverButton, clickButton, normalButton, hoverSound, clickSound, async function() {
      await battle.handleSwitch(option);
    },
    function() {
      return `${option.name} ${option.currentHp}/${option.maxHp}`;
    });
    switchMenu.appendChild(switchButton.element);
    buttons.push(switchButton);
  });
  let backButton = new Button("Back", hoverButton, clickButton, normalButton, hoverSound, clickSound, showMainMenu);
  switchMenu.appendChild(backButton.element);
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
    let itemEffectButton = new Button(`${option.name} ${option.currentHp}/${option.maxHp}`, hoverButton, clickButton, normalButton, hoverSound, clickSound, function() {
      battle.useItem(item, option);
      buttons.forEach(button => button.updateText());
    },
    function() {
      return `${option.name} ${option.currentHp}/${option.maxHp}`;
    });
    itemEffectMenu.appendChild(itemEffectButton.element);
    buttons.push(itemEffectButton);
  });
  let backButton = new Button("Back", hoverButton, clickButton, normalButton, hoverSound, clickSound, showMainMenu);
  itemEffectMenu.appendChild(backButton.element);
  buttons.push(backButton);
}

function showItemMenu() {
  clickSound.play();
  const itemMenu = document.getElementById("main-menu");
  const itemOptions = battle.currentTurn.items;
  itemMenu.innerHTML = "";
  buttons = [];
  itemOptions.forEach((option) => {
    let itemButton = new Button(`${option.name}, ${option.number}`, hoverButton, clickButton, normalButton, hoverSound, clickSound, function() {
      if (option.isRemaining()) {
        showItemEffectMenu(option);
      } else {
        displayMessage("You don't have any more of that item.");
      }
    },
    function() {
      return `${option.name}, ${option.number}`;
    });
    itemMenu.appendChild(itemButton.element);
    buttons.push(itemButton);
  });
  let backButton = new Button("Back", hoverButton, clickButton, normalButton, hoverSound, clickSound, showMainMenu);
  itemMenu.appendChild(backButton.element);
  buttons.push(backButton);
}

function showFleeMenu() {
  clickSound.play();
  const fleeMenu = document.getElementById("main-menu");
  fleeMenu.innerHTML = "";
  displayMessage("Are you sure you want to run away?");
  let fleeButton = new Button(`Flee`, hoverButton, clickButton, normalButton, hoverSound, clickSound, function() {
    flee();
  });
  fleeMenu.appendChild(fleeButton.element);
  let backButton = new Button("Back", hoverButton, clickButton, normalButton, hoverSound, clickSound, showMainMenu);
  fleeMenu.appendChild(backButton.element);
  buttons.push(backButton);
}

async function flee() {
  await sleep(200);
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
    buttons.forEach(button => button.updateText());
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
  buttons.forEach(button => {
    button.disable()
    console.log(button.disabled)
  })
}

function enableButtons() {
  buttons.forEach(button => button.enable());
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

document.getElementById("music-volume-slider").addEventListener("input", function() {
    music.volume = this.value;
});

document.getElementById("effects-volume-slider").addEventListener("input", function() {
    hoverSound.volume = this.value;
    clickSound.volume = this.value;
    attackSound.volume = this.value;
});

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
  let terraptor = new Monster("Terraptor", "Earth", 300, 50, 50, [
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
