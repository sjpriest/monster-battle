export class Move {
  constructor({
    name,
    type,
    power,
    affectsDefense = null,
    affectsOffense = null,
    affectsSelf = null,
    affectsEnemy = null,
    allEnemies = null,
    allAllies = null,
    maxUsage
  }) {
    this.name = name;
    this.type = type;
    this.power = power;
    this.affectsDefense = affectsDefense;
    this.affectsOffense = affectsOffense;
    this.affectsSelf = affectsSelf;
    this.affectsEnemy = affectsEnemy;
    this.allEnemies = allEnemies;
    this.allAllies = allAllies;
    this.maxUsage = maxUsage;
    this.currentUsage = maxUsage;
  }

    isUsable() {
    return this.currentUsage > 0;
  }

  use() {
    if (this.isUsable()) {
      this.currentUsage--;
    }
  }
};

const moves = {
  tackle: new Move({
    name: "Tackle", 
    type: "Normal", 
    power: 50, 
    maxUsage: 10
  }),

  vineWhip: new Move({
    name: "Vine Whip",
    type: "Grass",
    power: 100,
    maxUsage: 3
  }),

  intimidate: new Move({
    name: "Intimidate",
    type: "Normal",
    power: -25,
    maxUsage: 5,
    affectsDefense: true,
    affectsEnemy: true,
  }),

  tranquility: new Move({
    name: "Tranquility",
    type: "Grass",
    power: -100,
    maxUsage: 2,
    affectsSelf: true,
    allAllies: true
  }),

  escapeArtist: new Move({
    name: "Escape Artist",
    type: "Psychic",
    power: 50,
    maxUsage: 2,
    affectsDefense: true,
    affectsSelf: true
  }),

  psychicBark: new Move({
    name: "Psychic Bark",
    type: "Psychic",
    power: 30,
    maxUsage: 5,
    affectsDefense: true,
    affectsEnemy: true
  }),

  bite: new Move({
    name: "Bite",
    type: "Normal",
    power: 50,
    maxUsage: 10
  }),

  cerberusMaul: new Move({
    name: "Cerberus' Maul",
    type: "Psychic",
    power: 150,
    maxUsage: 2
  }),

  earthquake: new Move({
    name: "Earthquake",
    type: "Ground",
    power: 50,
    maxUsage: 2,
    allEnemies: true
  }),

  sliceAndDice: new Move({
    name: "Slice and Dice",
    type: "Normal",
    power: 75,
    maxUsage: 5
  }),

  hardenedShell: new Move({
    name: "Hardened Shell",
    type: "Normal",
    power: 50,
    maxUsage: 3,
    affectsDefense: true,
    affectsSelf: true
  }),

  flameThrower: new Move({
    name: "Flame Thrower", 
    type: "Fire", 
    power: 100, 
    maxUsage: 3
  }),

  incinerate: new Move({
    name: "Incinerate",
    type: "Fire",
    power: 25,
    maxUsage: 5,
    allEnemies: true
  }),

  burn: new Move({
    name: "Burn",
    type: "Fire",
    power: 30,
    maxUsage: 3,
    affectsOffense: true,
    affectsEnemy: true
  }),

  waterCannon: new Move({
    name: "Water Cannon",
    type: "Water",
    power: 100,
    maxUsage: 3
  }),

  clawsOfFury: new Move({
    name: "Claws of Fury",
    type: "Normal",
    power: 150,
    maxUsage: 2
  }),

  evade: new Move({
    name: "Evade",
    type: "Normal",
    power: 25,
    maxUsage: 2,
    affectsDefense: true,
    affectsSelf: true,
    allAllies: true
  }),

  terrorize: new Move({
    name: "Terrorize",
    type: "Normal",
    power: 40,
    maxUsage: 2,
    affectsDefense: true,
    affectsEnemy: true,
    allEnemies: true
  }),

  avalanche: new Move({
    name: "Avalance",
    type: "Rock",
    power: 100,
    maxUsage: 3
  })
};

export default moves;