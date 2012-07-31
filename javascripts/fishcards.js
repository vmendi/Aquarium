var FishCard = (function() {

  function FishCard(definition) {
    var self = this;
    this.definition = definition;
    _.extend(this, this.definition);

    // calculate prizes of variants
    _(this.variants).each(function(variant) {
      variant.prize = self.getPrize(variant);
    });
  }

  FishCard.prototype.bet = function(callback) {
    var self = this;

    window.TheBigFishServer.bet(self.definition, function (outcomeVariantIdx, payout) {
      var variantName = self.definition.variants[outcomeVariantIdx].name;
      callback(self.definition.id, variantName, payout);
    });
  }

  FishCard.prototype.render = function() {
    var template = _.template($('#fish-card-template').text());
    var variantTemplate = _.template($('#variant-card-template').text());
    this.variantHTML = _(this.variants).map(function(variant){ return variantTemplate(variant); }).join('')
    var html = template(this);
    this.$el = $(html);
    return this;
  }

  FishCard.prototype.getPrize = function(theVariant) {

    if (theVariant.name === 'die')
      return undefined;

    var dieChance = window.TheBigFishServer.getDieChance(this.definition);

    var totalNumbers = Math.floor(36 * theVariant.chance / 100);
    var amount = this.definition.price * (theVariant.chance + dieChance) / 100;

    return (amount * 100 / theVariant.chance).toFixed(2);
  }

  return FishCard;

})();

var fishDefinitions = {
  'bubblehead': {
    id: 'bubblehead',
    name: 'Bubblehead',
    price: 0.2,
    variants: [
      {
        chance: 20,
        name: "die"
      }, {
        chance: 40,
        name: "red"
      }, {
        chance: 40,
        name: "black"
      }
    ]
  },
  'cat': {
    id: 'cat',
    name: 'Cat Fish',
    price: 0.5,
    variants: [
      {
        chance: 40,
        name: "die"
      }, {
        chance: 40,
        name: "bnw"
      }, {
        chance: 20,
        name: "kitty"
      }
    ]
  },
  'seahorse': {
    id: 'seahorse',
    name: 'Sea Horse (New!)',
    price: 1,
    variants: [
      {
        chance: 50,
        name: "die"
      }, {
        chance: 30,
        name: "zebra"
      }, {
        chance: 17,
        name: "giraffe"
      }, {
        chance: 3,
        name: "unicorn"
      }
    ]
  }
};
