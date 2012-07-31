var BigFishServer = function() {}

BigFishServer.prototype.init = function(game_id, access_token) {

    this.sdk          = new Betable(game_id, access_token)
    this.game_id      = game_id;
    this.access_token = access_token
}

BigFishServer.prototype.bet = function(fishDefinition, callback) {
	var self = this;

	var bet_obj = {
        currency : 'GBP'
      , economy  : 'sandbox'
      , wagers   : generateWagers()
    }

	this.sdk.bet(bet_obj, bet_success, bet_error);

	function bet_success( data, xhr ) {
		console.log(data);
		console.log(xhr);

		var result = 0;
		var payout = 0;

		for (var i=0; i < data.outcomes.length; ++i) {
			if (data.outcomes[i].outcome === 'win') {
				result = i + 1; // +1 because 0 is reserved for die
				payout = data.outcomes[i].payout;
				break;
			}
		}
		callback(result, payout);
	}

	function bet_error( error ) {
		alert('bet error')
	}

	function generateWagers() {
		var currIdx = 1;
		var theWagers = [];
		var dieChance = Math.floor(self.getDieChance(fishDefinition));

		_.each(fishDefinition.variants, function (theVariant) {

			var nextTotal = Math.floor(36 * theVariant.chance / 100);

			if (theVariant.name !== 'die') {
				var amount = fishDefinition.price * (theVariant.chance + dieChance) / 100;
				var currWager = {
					wager: amount.toFixed(2)
				  , numbers: _.range(currIdx, currIdx + nextTotal)
				}

				theWagers.push(currWager);
			}

			currIdx = currIdx + nextTotal;
		});

		console.log(theWagers);

		return theWagers;
	}
}

BigFishServer.prototype.getDieChance = function(fishDefinition) {
	var dieChance;

	_.each(fishDefinition.variants, function (theVariant) {
		if (theVariant.name === 'die')
			dieChance = theVariant.chance;
	});

	dieChance = dieChance / (fishDefinition.variants.length - 1);

	return dieChance;
}