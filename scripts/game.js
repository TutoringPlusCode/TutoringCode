/**
 * Globals
 */

var koalas = [];

/**
 * Utils
 */

function setAttributes(model, options) {
    _.extend(model, options)
}

function randomBoolean() {
    return Math.random() < 0.5;
}

/**
 * Animal
 */

function Animal(defaults, options) {
    options = _.extend(defaults, options);
    setAttributes(this, options);
}

Animal.prototype.addClass = function(className) {
    $('#' + this.getId()).addClass(className || '');
};

Animal.prototype.removeClass = function(className) {
    $('#' + this.getId()).removeClass(className || '');
};

Animal.prototype.manageClasses = function(options) {
    this.addClass(options.add);
    this.removeClass(options.remove);
};

Animal.prototype.setElement = function() {
    var html = '<div id="' + this.getId() + '" class="' + this.initialCssClass + '">' +
        (this.innerElements  || '') +
        '</div>';
    $('#canvas').append(html);
};

Animal.prototype.getId = function() {
    return (this.idBase + String(this.index));
};

Animal.prototype.element = function() {
    return $('#' + this.getId());
};

Animal.prototype.setAnimationLoop = function(animationName, animationTime, immediate) {
    immediate = (immediate || false);
    var that = this;
    var animation = (this.animations || {})[animationName]
    if (animation && !this.currentAnimation) {
        that.currentAnimation = animationName;
        if (immediate) {
            animation(that, animationTime);
        }
        that.intervalId = setInterval(function() {
            // Every animation function should have the instance on which it is run as parameter
            if (that.currentAnimation === animationName) {
                animation(that, animationTime);
            }
        }, (animationTime + 5)); // We give interval 5 milliseconds to run non-animation code.        
    }
};

Animal.prototype.stopAnimationLoop = function() {
    this.currentAnimation = null;
    clearInterval(this.intervalId);
};

/**
 * Unicorn
 */

function Unicorn(options) {
    var defaults = {
        x: 0,
        y: 0,
        animations: getUnicornAnimations(),
        direction: 1, // 1: right, -1: left
        initialCssClass: 'unicorn',
        index: Counter.incrementCount('Unicorn'),
        idBase: 'unicorn-',
        innerElements: '<div id="fire"></div>',
        isFiring: false
    };
    Animal.call(this, defaults, options);
    this.setElement();
}

function getUnicornAnimations() {
    return {
        'move-right': function(unicorn, animationTime) {
            unicorn.element().animate({
                left: '+=10'
            }, animationTime, 'linear');
        },
        'move-left': function(unicorn, animationTime) {
            unicorn.element().animate({
                left: '-=10'
            }, animationTime, 'linear');
        }
    };
}

Unicorn.prototype = new Animal();

Unicorn.prototype.fire = function fire() {
    if (!this.isFiring) {
        var $elem = this.element().find('#fire');
        $elem.removeClass('firing');
        $elem.addClass('firing');
        this.isFiring = true;
        var that = this;
        function getExploder(model) {
            model.manageExplosions();
        }
        setTimeout(getExploder(that), 500);
        setTimeout(function() {
            $elem.removeClass('firing');
            that.isFiring = false;
        }, 700);
    }
};

Unicorn.prototype.fireElement = function fireElement() {
    return this.element().children('#fire');
};

Unicorn.prototype.manageExplosions = function manageExplosions() {
    var fireLeft = this.fireElement().offset().left;
    var fireWidth = this.fireElement().width();
    var fireRight = fireLeft + fireWidth;
    _.each(koalas, function(koala) {
        var koalaLeft = koala.element().offset().left;
        var koalaWidth = koala.element().width();
        var koalaRight = koalaLeft + koalaWidth;
        if ((koalaRight - 10) > fireLeft && (koalaLeft + 10) < fireRight) {
            koala.explode();
        }
    });
};

/**
 *  Koala
 */

function Koala(options) {
    var defaults = {
        x: 0,
        y: 0,
        animations: getKoalaAnimations(),
        direction: 1,
        initialCssClass: 'koala',
        index: Counter.incrementCount('Koala'),
        idBase: 'koala-'
    };
    Animal.call(this, defaults, options)
    this.setElement();  
}

function getKoalaAnimations() {
    return {
        'random-walk': function(koala, animationTime) {

            koala.reset();

            var delay = 5000;
            var wait = (Math.floor(Math.random() * 5000));
            setTimeout(function() {
                koala.element().animate({
                    left: ((koala.direction > 0 ? '+=' : '-=') + String(3000))
                }, (animationTime - delay), 'linear');
            }, wait);
        }
    };
}

Koala.prototype = new Animal();

Koala.prototype.reset = function reset() {
    var bool = randomBoolean();
    if (bool) {
        this.element().addClass('reverse');
        this.element().removeClass('exploding');
        this.element().css('left', String($('#canvas').width() + 50) + 'px');
        this.direction = -1;
    }
    else {
        this.element().removeClass('reverse exploding');
        this.element().css('left', '-50px');
        this.direction = 1;
    }
}

Koala.prototype.explode = function explode() {
    this.element().stop().addClass('exploding');
}

/**
 * Counter
 */

var Counter = (function() {
    var list = {};
    return {
        incrementCount: function incrementCount(model) {
            if (list[model]) {
                list[model] += 1;
                return list[model];
            } else {
                list[model] = 1;
                return list[model];
            }
        },
        getCount: function incrementCount(model) {
            return (list[model] || 0);
        }
    }
})();

/**
 * Runtime
 */

function getKoalaAnimator(koala) {
    return function() {
        koala.setAnimationLoop('random-walk', 45000, true);        
    }
}

$(document).ready(function() {
    var myUnicorn = new Unicorn({
        initialCssClass: 'unicorn'
    });
    var numberOfKoalas = 15
    for(i in _.range(0, numberOfKoalas)) {
        var koala = new Koala({
            initialCssClass: 'koala walking'
        });
        koalas.push(koala);
        var timeoutAmount = Math.floor(Math.random() * 45000);
        setTimeout(getKoalaAnimator(koala), timeoutAmount);
    }


    $(document).keydown(function (event) {
        switch(event.which) {
            case 39: // right arrow
                myUnicorn.manageClasses({
                    add: 'walking',
                    remove: 'reverse'
                });
                myUnicorn.direction = 1;
                myUnicorn.setAnimationLoop('move-right', 50);
                break;
            case 37: // left arrow
                myUnicorn.manageClasses({
                    add: 'reverse walking'
                });
                myUnicorn.direction = -1;
                myUnicorn.setAnimationLoop('move-left', 50);
                break;
            case 70: // f, or 'fire'
                myUnicorn.fire();
                break;
        }
    });

    $(document).keyup(function (event) {
        switch(event.which) {
            case 39:
                myUnicorn.manageClasses({
                    remove: 'walking'
                });
                myUnicorn.stopAnimationLoop();
                break;
            case 37:
                myUnicorn.manageClasses({
                    remove: 'walking'
                });
                myUnicorn.stopAnimationLoop();
                break;
        }
    });

});