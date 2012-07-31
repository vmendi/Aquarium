// For BADGES
var badge1bool = false;
var badge2bool = false;
var badge3bool = false;


$(function() {

  var fishCards = {
    bubblehead: new FishCard(fishDefinitions['bubblehead']),
    cat:        new FishCard(fishDefinitions['cat']),
    seahorse:   new FishCard(fishDefinitions['seahorse'])
  }

  //NOTE: This is to dynamicall load the fish but i couldnt get the _.each to work yet

  // var fishies = _.map(fishDefinitions, function(fish) {
  //   console.log("in fishies",fish);
  //   return new FishCard(fish);
  // });
  // console.log("fishies", fishies);
  // console.log("bubble", bubbleheadCard);
  // _.each(fishies, function(fish){
  //   console.log("in each", fish)
  //   $('#cards').append(fish.render());
  // });

  $('#cards').append(fishCards.bubblehead.render().$el);
  $('#cards').append(fishCards.cat.render().$el);
  $('#cards').append(fishCards.seahorse.render().$el);

  // Buy Egg button
  $(window).on('click', '.fish-card a.bet', function(event){
    var $button = $(this);
    var $el = $(this).parents('.fish-card');
    var race = $el.attr('data-fish-race');

    $('.balance').text(parseInt($('.balance').text() ,10) - fishCards[race].definition.price);
    $button.text('hatching...');

    setTimeout( function() {

      fishCards[race].bet(function(race, variant, payout) {
        window.TheBigFishServer.sdk.wallet(wallet_success, wallet_error);

        // Add fish to aquarium
        if (variant !== 'die') { // if LIVE
          alert("Wohoo. Your fish egg hatched and you made £"+ payout +" in real money");
          fish = new Fish(race, variant);
          aquarium.addFish(fish);

          if(badge3bool === false){
            addBadge(3, "You won your first fish, makin' dat paper!");
            $('.fish-card.seahorse').show();
          }
          if(badge1bool === false && aquarium.fishes.length == 3){
            addBadge(1, "You succesfully grew 3 fishies!!1!one!1");
          }

        } else { // if DIE
          alert("Sorry, your fish didn't hatch.");
        }

        function wallet_success( data, xhr ) {
          $('.balance').text(data.sandbox.balance); // Update Balance
          $button.text('Buy Egg'); // Remove 'loading' text from the button
        };

        function wallet_error( error ) {
          alert("wallet_error");
        }
      });
    }, 500);

    return false; // prevent default
  });

});

function addBadge( badge_num, text ){
  eval("badge"+badge_num+"bool"+"=true");
  $("#achievment-text").show().text(text).delay(7000).slideUp(1000);

  $("#badge"+badge_num).css({ opacity: 1.0 });
}
createFish = function() {
  f = new Fish('bubblehead', 'black');
  aquarium.addFish(f);
  return f;
}