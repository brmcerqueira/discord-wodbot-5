export type RollResult = {
  amount: number,
  modifier: number,
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

export function roll(amount: number, hunger: number, difficulty: number, modifier: number): RollResult {
  const dices: DiceResult[] = [];

  for (let i = 1; i <= amount; i++) {
    dices.push(throwDice(i <= hunger));
  }

  const computed = computedRoll(dices, difficulty);

  return {
    amount,
    modifier,
    hunger,
    difficulty,
    successes: computed.successes,
    status: computed.status,
    dices: computed.dices
  };
}

export function reRoll(result: RollResult, amount: number): RollResult {
  for (let i = result.dices.length - 1; i >= 0; i--) {
    if (!result.dices[i].isHunger) {
      result.dices[i] = throwDice();
      amount--;
      if (amount == 0) {
        break;
      }
    }
  }

  const computed = computedRoll(result.dices, result.difficulty);

  return {
    amount: result.amount,
    modifier: result.modifier,
    hunger: result.hunger,
    difficulty: result.difficulty,
    successes: computed.successes,
    status: computed.status,
    dices: computed.dices
  };
}

function computedRoll(dices: DiceResult[], difficulty: number): {
  successes: number,
  status: RollStatus,
  dices: DiceResult[]
} {
  let successes = 0;
  let status: RollStatus = RollStatus.Failure;
  let criticalStatus: RollStatus | null = null;
  let lastTen: DiceResult | null = null;
  let hasBestialFailure = false;

  for (const dice of dices) {
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
  }

  if (successes >= difficulty) {
    status = criticalStatus || RollStatus.Success;
  }
  else if (hasBestialFailure) {
    status = RollStatus.BestialFailure;
  }

  return {
    successes,
    status: status,
    dices: dices.sort((left, right) => right.value - left.value),
  };
}

function throwDice(isHunger = false): DiceResult {
  return {
    value: Math.floor((Math.random() * 10) + 1),
    isHunger: isHunger
  };
}