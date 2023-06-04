<!-- SECTION: USERS --> 



// async function getUserBalance(activeUser, (err, balance) => {
//   if (err) {
//     console.error('Error fetching balance:', err);
//   } else if (balance !== null) {
//     console.log('Balance fetched:', balance);
//   } else {
//     console.log('User not found.');
//   }
// });



// getUserBalance(userId) {
//   const response = await fetch(`/api/users/${userId}/balance`);
//   const data = await response.json();

//   return data.balance;
// }

function updateBalanceDisplay(balance) {
  const balanceElement = document.getElementById("balance");
  balanceElement.textContent = `Space Money: ${balance}`;
}

async function onUserLogin(userId) {
  const balance = await getUserBalance(userId);
  updateBalanceDisplay(balance);
}

