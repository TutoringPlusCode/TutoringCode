/**
 * Utils
 */

function setAttributes(model, options) {
	_.extend(model, options)
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
	console.log("this.getId in setElement", this.getId);
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
}

/**
 * Unicorn
 */

function Unicorn(options) {
	var defaults = {
		x: 0,
		y: 0,
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

Unicorn.prototype = new Animal();

Unicorn.prototype.fire = function fire() {
	if (!this.isFiring) {
		var $elem = this.element().find('#fire');
		$elem.removeClass('firing');
		$elem.addClass('firing');
		this.isFiring = true;
		var that = this;
		setTimeout(function() {
			$elem.removeClass('firing');
			that.isFiring = false;
		}, 700);
	}
}

/**
 *  Koala
 */

function Koala(options) {
	var defaults = {
		x: 0,
		y: 0,
		initialCssClass: 'koala',
		index: Counter.incrementCount('Koala'),
		idBase: 'koala-'
	};
	Animal.call(this, defaults, options)
	this.setElement();	
}

Koala.prototype = new Animal();

/**
 * Counter
 */

var Counter = (function() {
	var list = {};
	return {
		incrementCount: function incrementCount(model) {
			if (list[model]) {
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

$(document).ready(function() {
	var myUnicorn = new Unicorn({
		initialCssClass: 'unicorn'
	});

	var myKoala = new Koala({
		initialCssClass: 'koala walking'
	});

	$(document).keydown(function (event) {
		switch(event.which) {
			case 39: // right arrow
				myUnicorn.manageClasses({
					add: 'walking',
					remove: 'reverse'
				});
				myUnicorn.direction = 1;
				break;
			case 37: // left arrow
				myUnicorn.manageClasses({
					add: 'reverse walking'
				});
				myUnicorn.direction = -1;
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
				break;
			case 37:
				myUnicorn.manageClasses({
					remove: 'walking'
				});
				break;
		}
 	});

});
