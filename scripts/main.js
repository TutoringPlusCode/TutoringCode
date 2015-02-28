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
		id: Counter.incrementCount('Unicorn')
	};
	options = _.extend(defaults, options);
	setAttributes(this, options);
	this.setElement();
}

Unicorn.prototype.setElement = function() {
	var html = '<div id="unicorn-' + String(this.id) + '" class="' + this.initialCssClass + '"></div>';
	$('#canvas').append(html);
}

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
	var myUnicorn = new Unicorn();
});
