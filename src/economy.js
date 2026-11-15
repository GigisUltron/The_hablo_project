/* sema — earned coins and the small cosmetic sink.
 *
 * Coins are paid for real answers, never for opening the app, and they buy
 * looks only. There is no purchase, no loot and no learning locked behind the
 * currency. Pure arithmetic so the balance is testable.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SemaEconomy = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var THEMES = [
    { id: "ember", name: "Ember", cost: 0 },
    { id: "plum", name: "Plum", cost: 60 },
    { id: "moss", name: "Moss", cost: 120 }
  ];

  var DAILY_GOAL_COINS = 5;

  function theme(id) {
    for (var i = 0; i < THEMES.length; i += 1) {
      if (THEMES[i].id === id) return THEMES[i];
    }
    return THEMES[0];
  }

  function canBuy(coins, id) {
    var t = theme(id);
    return !!t && t.cost > 0 && Number(coins) >= t.cost;
  }

  /* A finished lesson pays for what was actually remembered: two coins for
   * showing up, one per first-try answer, three for a clean sheet. A 10-card
   * lesson therefore pays 12–15, and a theme is four or five lessons. */
  function sessionCoins(firstCorrect, perfect) {
    var good = Math.max(0, Math.round(Number(firstCorrect) || 0));
    return good + 2 + (perfect ? 3 : 0);
  }

  function vocabCoins(correct) {
    return 1 + Math.max(0, Math.round(Number(correct) || 0));
  }

  function dailyGoalCoins() {
    return DAILY_GOAL_COINS;
  }

  return {
    THEMES: THEMES,
    DAILY_GOAL_COINS: DAILY_GOAL_COINS,
    theme: theme,
    canBuy: canBuy,
    sessionCoins: sessionCoins,
    vocabCoins: vocabCoins,
    dailyGoalCoins: dailyGoalCoins
  };
});
