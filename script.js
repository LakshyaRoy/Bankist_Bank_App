'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const date = document.querySelector('.date');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const mov = sort ? movements?.slice()?.sort((a, b) => a - b) : movements;

  mov.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;

    const html = `<div class="movements__row">
<div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
<div class="movements__value">${mov}€</div>
</div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummery = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;
  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

// const user = `Steven Thomas Williams`; //stw
const createUserName = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(letter => letter[0])
      .join('');
  });
};

createUserName(accounts);

let currentAccount;
const updateUi = function (acc) {
  // display movements
  displayMovements(acc.movements);
  // display balance
  calcDisplayBalance(acc);
  // display summery
  calcDisplaySummery(acc);
  currDate();
};

const currDate = () => {
  date.textContent = '';
  const now = new Date();
  console.log(now);
  date.textContent = `${now.getDate()}/${
    now.getMonth() + 1
  }/${now.getFullYear()}`;
};

btnLogin.addEventListener('click', function (e) {
  //
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display ui and welcome message
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // clear input fields

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // update ui
    updateUi(currentAccount);
  } else {
    alert('Invalid username or pin');
  }
  console.log(currentAccount);
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 0.1)) {
    // /add movement
    currentAccount.movements.push(amount);
    // update ui
    updateUi(currentAccount);
  } else {
    alert(
      'Insufficient balance for Loan! , At least you should have 10% amount of the loan you are asking for! '
    );
  }

  inputLoanAmount.value = '';
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let transferAmount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    transferAmount > 0 &&
    receiverAcc &&
    currentAccount.balance >= transferAmount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-transferAmount);
    receiverAcc.movements.push(transferAmount);

    // update ui
    updateUi(currentAccount);
  } else {
    alert('Please Check Your Balance!');
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
    // delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  } else {
    alert('Incorrect Credentials');
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// Lecture
/////////////////////////////////////////////////
/////////////////////////////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// accumulator -> snowball
// const balance = movements.reduce((acc, cur, i, arr) => {
//   // console.log(`iteration ${i} : ${acc}`);
//   return acc + cur;
// }, 0);
// console.log(balance);
// const deposit = movements.filter(mov => {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposit);

// console.log('--------------------');
// const withdrawals = movements.filter(negative => {
//   return negative < 0;
// });
// console.log(movements);
// console.log(withdrawals);

const eurToUsd = 1.1;
//convert all the EUR to USD and add it as a movement in account1 object

/*
const movementUSD = movements.map(mov => {
  return mov * eurToUsd;
});

console.log(movements);
console.log(movementUSD);

const movementsDescription = movements.map((mov, i) => {
  return `Movement ${i + 1}: You ${
    mov > 0 ? 'deposited' : `withdrew`
  } ${Math.abs(mov)}`;
});

console.log(movementsDescription);

*/

/////////////////////////////////////////////////

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// const dogsJulia = [9, 16, 6, 8, 3];
// const dogsKate = [10, 5, 6, 1, 4];

// const checkDogs = function (dogsJulia, dogsKate) {
//   const newJuliaData = [...dogsJulia];
//   newJuliaData.splice(0, 1);
//   newJuliaData.splice(2, 4);

//   const dogs = newJuliaData.concat(dogsKate);
//   console.log(dogs);

//   dogs.forEach(function (dogAge, i) {
//     if (dogAge >= 3) {
//       return console.log(
//         `Dog number ${i + 1} is an adult, and is ${dogAge} years old`
//       );
//     } else {
//       return console.log(
//         `Dog number ${i + 1} is still a puppy 🐶 and is ${dogAge} years old`
//       );
//     }
//   });
// };

// checkDogs(dogsJulia, dogsKate);

// const calcAverageHumanAge = function (ages) {
//   let humanAge = ages.map(DogAge => {
//     if (DogAge <= 2) {
//       return 2 * DogAge;
//     } else {
//       return 16 + DogAge * 4;
//     }
//   });
//   const adults = humanAge.filter(age => age >= 18);
//   console.log(`adult : ${adults}`);

//   const avgAge = adults.reduce((acc, age, i, arr) => acc + age / arr.length, 0);

//   console.log(`avgAge : ${avgAge}`);
//   // If age greater than or equal to 18 then calculate average age as per the formula
// };
// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

// const ArrowCalcAvgAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// const avgee1 = ArrowCalcAvgAge([5, 2, 4, 1, 15, 8, 3]);
// const avgee2 = ArrowCalcAvgAge([16, 6, 10, 5, 6, 1, 4]);

// console.log('arrow=>', avgee1, avgee2);
// /////////////////////////////////////////////

// maximum value of movements -> array using reduce method in JavaScript:

// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) {
//     return acc;
//   } else {
//     return mov;
//   }
// }, movements[0]);

// console.log(max);

// const arr = [[1, 2, 3], [4, 5, 6], [7, 8, 9], 10];
// // console.log(arr.flat());

// const arrDeep = [[1, [22, [112, 114], 11, 12], 2, 3], [4, 5, 6], [7, 8, 9], 10];

// console.log(arrDeep.flat(3));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// const overAllBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overAllBalance);

// flat
// want to go i level deep then use flat else use flatmap
// const overAllBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(overAllBalance);

// // flatmap

// const overAllBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(overAllBalance2);
// strings
// const owners = ['jonas', 'ack', 'ill', 'ames'];
// console.log(owners.sort());

// // numbers
// console.log(movements);
// // console.log(movements.sort());

// // return < 0, A, B (keep order)
// // return > 0, B, A (switch order)
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });

// console.log(movements);

// const arr = [1, 2, 3, 4, 5, 6, 7];
// arr.fill(23, 2, 4);
// console.log(arr);
// const x = new Array(7);
// console.log(x);

// //  Array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// labelBalance.addEventListener('click', () => {
//   const movementsUi = Array.from(
//     document.querySelectorAll('.movements__value'),
//     mov => Number(mov.textContent.replace('€', ''))
//   );

//   console.log(movementsUi.reduce((acc, mov) => acc + mov, 0));
// });

// const bankDepositeSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((sum, acc) => sum + acc, 0);

// console.log(bankDepositeSum);

// // const NumDeposit1000 = accounts
// //   .flatMap(acc => acc.movements)
// //   .filter(mov => mov >= 1000).length;

// const NumDeposit1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, acc) => (acc >= 1000 ? count + 1 : count), 0);

// console.log(NumDeposit1000);

// const sums = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, curr) => {
//       curr > 0 ? (sums.deposit += curr) : (sums.withdraw += curr);
//       sums.balance = sums.deposit - sums.withdraw;

//       return sums;
//     },
//     { deposit: 0, withdraw: 0, balance: 0 }
//   );

// console.log(sums);

// const convertTitleCAse = function (title) {
//   const exceptions =  ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
//   const titleCase = title.
// };

// console.log(convertTitleCAse('this is a nice title'));
// console.log(convertTitleCAse('This Is a Nice Title'));
// console.log(convertTitleCAse('and here is an another title with na Example '));
