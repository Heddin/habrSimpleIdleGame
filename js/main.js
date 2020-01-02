const UPG_COPPER_MINE_TEXT = 'Copper mine upgrade:';
const UPG_SILVER_MINE_TEXT = 'Silver mine upgrade:';
const COINS = 'coins';
const COPPER_COINS = 'Copper ' + COINS + ':';
const COPPER_RATE = 'Copper coins rate:';
const NOT_ENOUGH_COINS = 'Not enough ' + COINS;
const WIN_MESSAGE = 'Congratulations! Target achieved!';
const COPPER_SILVER_RATE = 10;

let silverMineBasePriceCoppers = 100;
let game = {
  coppers: 0,
  silvers: 0,
  total: 0,
  copperGrowth: 1,
  silverGrowth: 1,
  coppersUpgradeCost: 10,
  silverUpgradeCost: 50,
  copperUpgradeLevel: 1,
  silverUpgradeLevel: 0,
  winCondition: 10000,
};
let save = JSON.parse(localStorage.getItem('auto_gameState'));
    document.getElementById('spnNeedCopper').innerHTML = game.winCondition.toString();

if(save){
  game = save;
}
let myTimer = setInterval(endOfTurnCalc, 2000);

function endOfTurnCalc() {
  if (game.total < game.winCondition) {
    game.coppers += game.copperGrowth * game.copperUpgradeLevel;
    if(game.silverUpgradeLevel) {
      game.silvers += Math.ceil(game.silverGrowth * game.silverUpgradeLevel * 0.5);
    }
    countTotal();
    updateUI(game);
    saveGame(true);
  } else {
    clearTimeout(myTimer);
    localStorage.removeItem('auto_gameState');
    alert(WIN_MESSAGE);
  }
}
function coppersUpgCost() {
  return game.copperUpgradeLevel * 10 + 5;
}
function silverUpgCost() {
  return (game.silverUpgradeLevel) ? game.silverUpgradeLevel * 10 + 5 : silverMineBasePriceCoppers;
}
function upgCopperMine() {
  if (game.coppers >= coppersUpgCost()) {

    game.coppers = game.coppers - coppersUpgCost();
    game.copperUpgradeLevel++;

    updateUI(game);
  } else {
    alert(NOT_ENOUGH_COINS)
  }
}
function upgSilverMine() {
  if (game.silverUpgradeLevel === 0) {
    if (game.coppers >= silverMineBasePriceCoppers) {
      game.coppers = game.coppers - silverMineBasePriceCoppers;
      game.silverUpgradeLevel = 1;
    }
  } else {
    if (game.silvers >= silverUpgCost()) {
      game.silvers -= silverUpgCost();
      game.silverUpgradeLevel++;
    }
  }

  updateUI(game);
}
function saveGame(auto) {
  if(auto){
    localStorage.setItem('auto_gameState',JSON.stringify(game))
  }else{
    localStorage.setItem('gameState', JSON.stringify(game));
  }

}
function loadGame() {
  game = JSON.parse(localStorage.getItem('gameState'));
  updateUI(game);
}
function countTotal(){
  game.total = game.coppers + (COPPER_SILVER_RATE * game.silvers);
}
function updateUI(game) {
  let copperRate = game.copperGrowth * game.copperUpgradeLevel;
  let silverRate = Math.ceil(game.silverGrowth * game.silverUpgradeLevel * 0.5);

  document.getElementById("spnCoppersValue").innerHTML = game.coppers.toString();
  document.getElementById("spnSilverValue").innerHTML = game.silvers.toString();
  document.getElementById("spnTotalCoppersValue").innerHTML = game.total.toString();
  document.getElementById("btnUpgCopperMine").innerHTML = `${UPG_COPPER_MINE_TEXT} ${coppersUpgCost()} ${COINS}`;
  document.getElementById("btnUpgSilverMine").innerHTML = `${UPG_SILVER_MINE_TEXT} ${silverUpgCost()} ${COINS}`;
  document.getElementById("spnCopperRate").innerHTML = copperRate.toString();
  document.getElementById("spnSilverRate").innerHTML = silverRate.toString();
  document.getElementById('copperLvlVal').innerHTML = game.copperUpgradeLevel;
  if(game.silverUpgradeLevel) {
    document.getElementById('silverLvlVal').innerHTML = game.silverUpgradeLevel;
  }
}
