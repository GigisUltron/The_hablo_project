/* Reading — graded texts. `band` is the CEFR grade; `level` is the reader's
 * numeric shelf. Every wrong option carries a why. */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-zh-shichang",
      title: "星期六的市场",
      level: 1,
      band: "A1",
      body: "星期六早上，社区的市场七点开门。妈妈买面包、水果和咖啡。我买水，还带一个苹果当早饭。摊主笑着说：「早上好。」我们付了钱，走路回家。在家里我们一起喝咖啡。然后我看书，妈妈在花园里干活。",
      questions: [
        {"q": "妈妈买什么？", "options": ["面包、水果和咖啡", "水和一个苹果", "花和牛奶"], "answer": 0, "why": ["", "那是叙述者买的", "文中没提花和牛奶"]},
        {"q": "他们怎么回家？", "options": ["坐公共汽车", "走路", "开车"], "answer": 1, "why": ["文中说他们走路回家", "", "文中没提汽车"]},
        {"q": "市场几点开门？", "options": ["七点", "九点", "中午"], "answer": 0, "why": ["", "文中说七点", "文中没提中午"]},
      ]
    },
    {
      id: "tx-zh-huoche",
      title: "六点的火车",
      level: 2,
      band: "A2",
      body: "六点的火车从中央车站出发。那天早上我晚到了一分钟，门已经关了。我沿着站台跑，但火车开始移动。工作人员让我等下一班。我喝了杯咖啡，看着旅客。下一班火车八点到了。我上了车，在窗边找到座位，松了一口气。迟到花了我一个小时，却给了我一本书和一杯咖啡。",
      questions: [
        {"q": "叙述者为什么错过了火车？", "options": ["他晚到了一分钟", "火车提前开了", "他走错了站台"], "answer": 0, "why": ["", "文中没说火车提前开", "他跑的是正确的站台"]},
        {"q": "等车时他做了什么？", "options": ["喝咖啡、看旅客", "回家了", "给单位打电话"], "answer": 0, "why": ["", "他留在车站", "文中没提到电话"]},
        {"q": "最后他感觉怎样？", "options": ["对工作人员生气", "虽然迟到了却松了口气", "急着再次出发"], "answer": 1, "why": ["他没有责怪工作人员", "", "他刚坐下并松了口气"]},
      ]
    },
    {
      id: "tx-zh-mianbao",
      title: "关门的面包店",
      level: 3,
      band: "B1",
      body: "街角的面包店在春天关门了。店主想退休，没有人接手。从那以后，早晨安静了：人们得走到超市，那里的面包更差，队伍更长。邻居们说要开一家店，但租金太高。上周，一位年轻女人来了。她看了看橱窗，拍了照片，问了租金。没人知道她会不会回来。现在面包店还关着，大家都在等。",
      questions: [
        {"q": "面包店为什么关门？", "options": ["店主想退休", "面包不好吃", "租金太低"], "answer": 0, "why": ["", "面包很好吃", "文中说租金太高"]},
        {"q": "邻居们现在做什么？", "options": ["去超市", "在家烤面包", "开了一家店"], "answer": 0, "why": ["", "文中没有写", "他们只是在谈论"]},
        {"q": "年轻女人的到来暗示什么？", "options": ["她也许想接手店铺", "她是新面包师", "她想买照片"], "answer": 0, "why": ["", "没人知道她会不会回来", "她拍了橱窗的照片"]},
      ]
    },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("zh", "texts", SEMA_TEXTS);
}
