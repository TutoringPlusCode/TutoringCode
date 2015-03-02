/**
 * Unicorn
 */

function setAttributes(model, options) {
	_.extend(model, options)
}

function Unicorn(options) {
	var defaults = {
		x: 0,
		y: 0,
		initialCssClass: 'unicorn',
		index: Counter.incrementCount('Unicorn')
	};
	options = _.extend(defaults, options);
	setAttributes(this, options);
	this.setElement();
}

Unicorn.prototype.setElement = function() {
	console.log("this.getId in setElement", this.getId);
	var html = '<div id="' + this.getId() + '" class="' + this.initialCssClass + '"></div>';
	$('#canvas').append(html);
};

Unicorn.prototype.getId = function() {
	return ('unicorn-' + String(this.index));
};

Unicorn.prototype.addClass = function(className) {
	$('#' + this.getId()).addClass(className || '');
};

Unicorn.prototype.removeClass = function(className) {
	$('#' + this.getId()).removeClass(className || '');
};

Unicorn.prototype.manageClasses = function(options) {
	this.addClass(options.add);
	this.removeClass(options.remove);
};


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

	$(document).keydown(function (event) {
		switch(event.which) {
			case 39:
				myUnicorn.manageClasses({
					add: 'running',
					remove: 'reverse'
				});
				break;
			case 37:
				myUnicorn.manageClasses({
					add: 'reverse running'
				});
				break;
		}
 	});

	$(document).keyup(function (event) {
		switch(event.which) {
			case 39:
				myUnicorn.manageClasses({
					remove: 'running'
				});
				break;
			case 37:
				myUnicorn.manageClasses({
					remove: 'running'
				});
				break;
		}
 	});

});
