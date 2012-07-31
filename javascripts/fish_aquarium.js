var aquarium = {
  $el: $('#aquarium-container'),
  width: function() {
    return this.$el.width();
  },
  height: function() {
    return this.$el.height();
  },
  fishes: [],
  addFish: function(fish) {
    this.fishes.push(fish);
    this.$el.append(fish.$el);
    fish.randomPosition();
    fish.animate();
  },
  isInTheRightSide: function(fish) {
    var half = (this.width() - fish.width()) / 2;
    return fish.$el.position().left > half;
  }
};

var Fish = (function() {

  function Fish(race, variant) {
    var src;
    this.race = race;
    this.variant = variant;
    src = "../images/" + this.race + "_" + this.variant + ".png";
    this.$el = $('<img class="fish" src="' + src + '" />');
  }

  Fish.prototype.animate = function() {
    var self = this;
    var pointX, pointY;
    // set point
    if (aquarium.isInTheRightSide(this)) {
      pointX = Math.random() * 400; // between 0 and 400
      pointY = Math.random() * 100; // between 0 and 100
      self.faceLeft();

    } else {
      pointX = aquarium.width() - this.width() - (Math.random() * 400);
      pointY = aquarium.height() - this.height() - (Math.random() * 100);
      self.faceRight();
    }
    this.$el.animate({
        left: pointX,
        top: pointY
      }, 5000 + (Math.random() * 3000), function() {
        self.animate();
      }
    );
  };

  Fish.prototype.width = function(){ return 100; }; // we do a fixed 100px size to make things easier
  Fish.prototype.height = function(){ return 100; }; // we do a fixed 100px size to make things easier
  Fish.prototype.faceRight = function() { this.$el.addClass('to-right'); this.$el.removeClass('to-left'); };
  Fish.prototype.faceLeft = function() { this.$el.addClass('to-left'); this.$el.removeClass('to-right'); };

  Fish.prototype.randomPosition = function() {
    this.moveTo(
      Math.random() * (aquarium.width() - this.width()),
      Math.random() * (aquarium.height() - this.height())
    );
  };

  Fish.prototype.moveTo = function(x, y) {
    this.$el.css({
      left: parseInt(x, 10),
      top: parseInt(y, 10)
    });
  };

  return Fish;

})();
