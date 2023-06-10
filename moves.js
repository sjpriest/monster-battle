export const Targets = {
  Self: "self",
  Enemy: "enemy",
  Allies: "allies",
  Enemies: "enemies",
};

export class Move {
  constructor({
    name,
    type,
    power,
    affectsDefense = null,
    affectsOffense = null,
    affectsHp = true,
    targets,
    maxUsage,
  }) {
    this.name = name;
    this.type = type;
    this.power = power;
    this.affectsDefense = affectsDefense;
    this.affectsOffense = affectsOffense;
    this.affectsHp = affectsHp;
    this.targets = targets;
    this.maxUsage = maxUsage;
    this.currentUsage = maxUsage;
  }

  isUsable() {
    return this.currentUsage > 0;
  }

  use() {
    if (this.isUsable()) {
      this.currentUsage--;
    } else {
      return null;
    }
  }
}

const moves = {
  tackle: new Move({
    name: "Tackle",
    type: "Normal",
    targets: [Targets.Enemy],
    power: 50,
    maxUsage: 10,
  }),

  vineWhip: new Move({
    name: "Vine Whip",
    type: "Grass",
    targets: [Targets.Enemy],
    power: 100,
    maxUsage: 3,
  }),

  intimidate: new Move({
    name: "Intimidate",
    type: "Normal",
    power: -25,
    maxUsage: 5,
    affectsDefense: true,
    affectsHp: false,
    targets: [Targets.Enemy],
  }),

  tranquility: new Move({
    name: "Tranquility",
    type: "Grass",
    power: 100,
    affectsHp: true,
    maxUsage: 2,
    targets: [Targets.Enemies],
  }),

  escapeArtist: new Move({
    name: "Escape Artist",
    type: "Psychic",
    power: 50,
    maxUsage: 2,
    affectsDefense: true,
    affectsHp: false,
    targets: [Targets.Self],
  }),

  psychicBark: new Move({
    name: "Psychic Bark",
    type: "Psychic",
    power: 30,
    maxUsage: 5,
    affectsDefense: true,
    affectsHp: false,
    targets: [Targets.Enemy],
  }),

  bite: new Move({
    name: "Bite",
    type: "Normal",
    power: 50,
    maxUsage: 10,
    targets: [Targets.Enemy],
  }),

  cerberusMaul: new Move({
    name: "Cerberus' Maul",
    type: "Psychic",
    power: 150,
    maxUsage: 2,
    targets: [Targets.Enemy],
  }),

  earthquake: new Move({
    name: "Earthquake",
    type: "Ground",
    power: 50,
    maxUsage: 2,
    targets: [Targets.Enemies],
  }),

  sliceAndDice: new Move({
    name: "Slice and Dice",
    type: "Normal",
    power: 75,
    maxUsage: 5,
    targets: [Targets.Enemy],
  }),

  hardenedShell: new Move({
    name: "Hardened Shell",
    type: "Normal",
    power: 50,
    maxUsage: 3,
    affectsDefense: true,
    affectsHp: false,
    affectsSelf: true,
    targets: [Targets.Self],
  }),

  flameThrower: new Move({
    name: "Flame Thrower",
    type: "Fire",
    power: 100,
    maxUsage: 3,
    targets: [Targets.Enemy],
  }),

  incinerate: new Move({
    name: "Incinerate",
    type: "Fire",
    power: 25,
    maxUsage: 5,
    targets: [Targets.Enemies],
  }),

  burn: new Move({
    name: "Burn",
    type: "Fire",
    power: -25,
    maxUsage: 3,
    affectsOffense: true,
    affectsHp: false,
    targets: [Targets.Enemy],
  }),

  waterCannon: new Move({
    name: "Water Cannon",
    type: "Water",
    power: 100,
    maxUsage: 3,
    targets: [Targets.Enemy],
  }),

  clawsOfFury: new Move({
    name: "Claws of Fury",
    type: "Normal",
    power: 150,
    maxUsage: 2,
    targets: [Targets.Enemy],
  }),

  evade: new Move({
    name: "Evade",
    type: "Normal",
    power: 25,
    maxUsage: 2,
    affectsDefense: true,
    affectsHp: false,
    targets: [Targets.Allies],
  }),

  terrorize: new Move({
    name: "Terrorize",
    type: "Normal",
    power: -40,
    maxUsage: 2,
    affectsDefense: true,
    affectsHp: false,
    targets: [Targets.Enemies],
  }),

  avalanche: new Move({
    name: "Avalanche",
    type: "Rock",
    power: 100,
    maxUsage: 3,
    targets: [Targets.Enemy],
  }),
};

export default moves;
