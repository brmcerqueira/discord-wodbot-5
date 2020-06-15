export type RollResult = {
  amount: number,
  hunger: number
  difficulty: number,
  successes: number,
  status: RollStatus,
  dices: DiceResult[]
}

export type DiceResult = {
  value: number,
  isHunger: boolean
}

export enum RollStatus {
  BestialFailure,
  Failure,
  Success,
  RegularCritical,
  MessyCritical
}

export function roll(amount: number, hunger: number, difficulty: number): RollResult {
  let successes: number = 0;
  let dices: DiceResult[] = [];
  let status: RollStatus = RollStatus.Failure;
  let criticalStatus: RollStatus | null = null;
  let lastTen: DiceResult | null = null;
  let hasBestialFailure: boolean = false;
  
  for (let i = 0; i < amount; i++) {
    let dice = rollDice(i < hunger);
    if (dice.value >= 6) {
      successes++;
      if (dice.value == 10) {
        if (lastTen) {
          successes += 2;
          if (lastTen.isHunger || dice.isHunger) {
            criticalStatus = RollStatus.MessyCritical;
          } else if (criticalStatus != RollStatus.MessyCritical) {
            criticalStatus = RollStatus.RegularCritical;
          }
          lastTen = null;
        } else {
          lastTen = dice;
        }
      }
    } else if (dice.value == 1 && dice.isHunger) {
      hasBestialFailure = true;
    }
    dices.push(dice);
  }

  if (successes >= difficulty) {
    status = criticalStatus || RollStatus.Success;
  }
  else if (hasBestialFailure) {
    status = RollStatus.BestialFailure;
  }

  return {
    amount,
    hunger,
    difficulty,
    successes,
    status: status,
    dices: dices.sort((left, right) => right.value - left.value),
  };
}

function rollDice(isHunger: boolean = false): DiceResult {
  return {
    value: Math.floor((Math.random() * 10) + 1),
    isHunger: isHunger
  };
}