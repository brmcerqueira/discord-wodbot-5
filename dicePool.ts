export type RollResult = {
  successes: number,
  dices: number[],
  isCriticalFailure: boolean
}

export type Roll = {
  amount: number,
  explosion: number,
  isCanceller: boolean
  result: RollResult
}

export function roll(amount: number, explosion: number, isCanceller: boolean): RollResult {
  if (explosion) {
    if (explosion > 11) {
      explosion = 11;
    } else if (explosion < 8) {
      explosion = 8;
    }
  } else {
    explosion = 11
  }

  let successes: number = 0;
  let dices: number[] = [];
  let isCriticalFailure: boolean = false;

  if (amount <= 0) {
    amount = 0;
    let dice = d10();
    if (dice == 10) {
      successes++;
      amount++;
    } else if (dice == 1) {
      isCriticalFailure = true;
    }
    dices.push(dice);
  }

  for (let i = 0; i < amount; i++) {
    let dice = d10();
    if (dice >= 8) {
      successes++;
      if (dice >= explosion) {
        amount++;
      }
    } else if (isCanceller && dice == 1) {
      successes--;
    }
    dices.push(dice);
  }

  return {
    successes,
    dices: dices.sort((a, b) => b - a),
    isCriticalFailure
  };
}

function d10(): number {
  return Math.floor((Math.random() * 10) + 1);
}