var money = 0;
var prestige = 1;
var prestigeFormula = function () {
    //return 1000000 * Math.pow(10, Math.log(prestige) / Math.log(2)) * 2;
    return 2000000 * Math.pow(3, (Math.log(prestige) / Math.log(2)));
};
var totalRevenue = [ 0, 0, 0, 0, 0, 0, 0 ];
var totalUpgrades = [ 0, 0, 0, 0, 0, 0, 0 ];

var BUY_ONE = 0;
var BUY_TEN = 1;
var BUY_MAX = 2;
var buyState = BUY_ONE;

var shoppedItem1 = false;
var shoppedItem2 = false;
var shoppedItem3 = false;

var defaultTrack = true;
var defaultSkin = true;

var fillsPerSecond = 0;
var numberOfAchievements = 0;

var barColors = [
    "red",
    "orange",
    "lime",
    "cyan",
    "salmon",
    "rgb(230, 230, 30)",
    "rgb(180, 180, 180)",
];

var Bar = function (color) {
    this.color = color;
    this.value = 0;
    this.alpha = 0;
    this.unlocked = false;
    this.price = 0;
          
    this.fillSpeed = 0.3;
    this.fillSpeedPrice = 5;
    this.fillSpeedNext = 0.3;
    this.fillSpeedUpdate = 0;
    this.fillSpeedFormula = null;
    this.fillSpeedPriceFormula = null;

    this.fillValue = 1;
    this.fillValuePrice = 20;
    this.fillValueNext = 1;
    this.fillValueUpdate = 0;
    this.fillValueFormula = null;
    this.fillValuePriceFormula = null;
    
    this.level = 1;
 };
 
function levelMultiplier(bar) {
    return Math.pow(2, bar.level - 1);
}
function levelMultiplierPrice(bar) {
    return Math.pow(1.5, bar.level - 1);
}

var bars = [];

var initialize = function () {
    bars = [];
    
    for (var i = 0; i < 7; i++) {
        bars.push(new Bar(barColors[i]));
    }

    bars[0].price = 0;
    bars[0].fillSpeedInit         = function ()  { return 0.3; };
    bars[0].fillSpeedFormula      = function (t) { return 0.3 + (0.05+0.04*0) * t / 2;  };
    bars[0].fillSpeedPriceFormula = function (t) { return 1 * Math.pow(1.3, t);  };
    bars[0].fillValueInit         = function ()  { return 2; }
    bars[0].fillValueFormula      = function (t) { return 2 + 1 * t * levelMultiplier(this) * 2;  };
    bars[0].fillValuePriceFormula = function (t) { return 1 * Math.pow(1.1, t) * levelMultiplierPrice(this);  };
    bars[0].fillSpeedNext = bars[0].fillSpeedInit();
    bars[0].fillValueNext = bars[0].fillValueInit();

    bars[1].price = 500;
    bars[1].fillSpeedInit         = function ()  { return 0.2; };
    bars[1].fillSpeedFormula      = function (t) { return 0.2 + (0.05+0.03*0) * t / 2;  };
    bars[1].fillSpeedPriceFormula = function (t) { return 2 * Math.pow(1.4, t); };
    bars[1].fillValueInit         = function ()  { return 20; }
    bars[1].fillValueFormula      = function (t) { return 20 + 10 * t * levelMultiplier(this) * 2; };
    bars[1].fillValuePriceFormula = function (t) { return 1 * Math.pow(1.3, t) * levelMultiplierPrice(this); };
    bars[1].fillSpeedNext = bars[1].fillSpeedInit();
    bars[1].fillValueNext = bars[1].fillValueInit();

    bars[2].price = 20000;
    bars[2].fillSpeedInit         = function ()  { return 0.2; };
    bars[2].fillSpeedFormula      = function (t) { return 0.2 + (0.045+0.03*0) * t / 2;  };
    bars[2].fillSpeedPriceFormula = function (t) { return 2 * Math.pow(1.5, t); };
    bars[2].fillValueInit         = function ()  { return 300; }
    bars[2].fillValueFormula      = function (t) { return 300 + 25 * t * levelMultiplier(this) * 2; };
    bars[2].fillValuePriceFormula = function (t) { return 1 * Math.pow(1.4, t) * levelMultiplierPrice(this); };
    bars[2].fillSpeedNext = bars[2].fillSpeedInit();
    bars[2].fillValueNext = bars[2].fillValueInit();

    bars[3].price = 100000;
    bars[3].fillSpeedInit         = function ()  { return 0.2; };
    bars[3].fillSpeedFormula      = function (t) { return 0.2 + (0.045+0.02*0) * t / 2;  };
    bars[3].fillSpeedPriceFormula = function (t) { return 2 * Math.pow(1.6, t); };
    bars[3].fillValueInit         = function ()  { return 1000; }
    bars[3].fillValueFormula      = function (t) { return 1000 + 50 * t * levelMultiplier(this) * 2; };
    bars[3].fillValuePriceFormula = function (t) { return 1 * Math.pow(1.5, t) * levelMultiplierPrice(this); };
    bars[3].fillSpeedNext = bars[3].fillSpeedInit();
    bars[3].fillValueNext = bars[3].fillValueInit();

    bars[4].price = 400000;
    bars[4].fillSpeedInit         = function ()  { return 0.2; };
    bars[4].fillSpeedFormula      = function (t) { return 0.2 + (0.04+0.02*0) * t / 2;  };
    bars[4].fillSpeedPriceFormula = function (t) { return 2 * Math.pow(1.7, t); };
    bars[4].fillValueInit         = function ()  { return 5000; }
    bars[4].fillValueFormula      = function (t) { return 5000 + 100 * t * levelMultiplier(this) * 2; };
    bars[4].fillValuePriceFormula = function (t) { return 1 * Math.pow(1.3, t) * levelMultiplierPrice(this); };
    bars[4].fillSpeedNext = bars[4].fillSpeedInit();
    bars[4].fillValueNext = bars[4].fillValueInit();

    bars[5].price = 10000000;
    bars[5].fillSpeedInit         = function ()  { return 0.2; };
    bars[5].fillSpeedFormula      = function (t) { return 0.2 + (0.03+0.01*0) * t / 2;  };
    bars[5].fillSpeedPriceFormula = function (t) { return 2 * Math.pow(1.8, t); };
    bars[5].fillValueInit         = function ()  { return 20000; }
    bars[5].fillValueFormula      = function (t) { return 20000 + 500 * t * levelMultiplier(this); };
    bars[5].fillValuePriceFormula = function (t) { return 1 * Math.pow(1.1, t) * levelMultiplierPrice(this); };
    bars[5].fillSpeedNext = bars[5].fillSpeedInit();
    bars[5].fillValueNext = bars[5].fillValueInit();

    bars[6].price = 300000000;//1000000000;
    bars[6].fillSpeedInit         = function ()  { return 0.2; };
    bars[6].fillSpeedFormula      = function (t) { return 0.2 + (0.025+0.01*0) * t / 12;  };
    bars[6].fillSpeedPriceFormula = function (t) { return 2 * Math.pow(1.9, t); };
    bars[6].fillValueInit         = function ()  { return 300000; }
    bars[6].fillValueFormula      = function (t) { return 300000 + 999 * t * levelMultiplier(this) * 6; };
    bars[6].fillValuePriceFormula = function (t) { return 1 * Math.pow(1.2, t) * levelMultiplierPrice(this); };
    bars[6].fillSpeedNext = bars[6].fillSpeedInit();
    bars[6].fillValueNext = bars[6].fillValueInit();
    
    for (var i = 0; i < 7; i++) {
        buyFillSpeedUpdate(bars[i]);
        buyFillValueUpdate(bars[i]);
    }

    money = 0;
    
    // debug
    //bars[0].unlocked = true;
    //bars[1].unlocked = true;
};
