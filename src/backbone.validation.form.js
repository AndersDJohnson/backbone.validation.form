(function (root, factory) {
  var name = 'BackboneValidationForm';
  if (typeof define === 'function' && define.amd) {
    define(['underscore'], function (_) {
      return (root[name] = factory(_));
    });
  }
  else if (typeof exports === 'object') {
    module.exports = factory(require('underscore'));
  }
  else {
    root[name] = factory(root._);
  }
}(this, function (_) {

  var exports = {};


  //exports.debug = true;


  // array of plugin functions: `function ($el, rule)`
  var plugins = [];


  exports.addPlugin = function (fn) {
    plugins.push(fn);
  };


  var elementToRuleHelpers = {};
  exports.elementToRuleHelpers = elementToRuleHelpers;

  elementToRuleHelpers.ifAnyMatch = function ($input, rule, selector, yesFn) {
    var $match = $input.filter(selector);
    if (! $match.length) {
      if (exports.debug) console.log('no matches', selector, $input);
      return;
    }
    yesFn();
  };

  elementToRuleHelpers.typeAttribute = function ($input, rule, value, pattern) {
    pattern = pattern || value;
    if ($input.is('[type="' + value + '"]')) {
        rule.pattern = pattern;
    }
  };

  elementToRuleHelpers.integerAttribute = function ($input, rule, attr, prop) {
    prop = prop || attr;
    var value = $input.attr(attr);
    if (value) {
        rule[prop] = parseInt(value);
    }
  };


  var stringify = function (value) {
    if (_.isArray(value)) {
      value = value.join(',');
    };
    return value;
  }


  exports.update = function (view, options) {

    var defaultOptions = {
      model: view.model,
      selector: [
        'input[name]:not([type="submit"],[type="button"])',
        'textarea[name]',
        'select[name]'
      ],
      /**
       * Exclude any element with a `novalidate` attribute, or with such an ancestor.
       */
      exclude: function ($el) {
        return $el.closest('[novalidate]').length;
      },
      getAttributeFromElement: function ($el) {
        return $el.attr('name');
      }
    };

    options = _.extend({}, defaultOptions, options);


    var model = options.model;
    model.validation = model.validation || {};

    var existing = _.result(model, 'validation');
    var validation = _.extend({}, existing);


    var selector = stringify(options.selector);
    var $inputs = view.$(selector);

    $inputs = $inputs.filter(function (index, el) {
      var $el = $(el);
      return ! options.exclude($el);
    });


    /**
     * Note: A single attribute could run through the logic multiple times
     *  since it may map to multiple elements, e.g. for radios and checkboxes
     */
    $inputs.each(function (index, el) {

      var $input = $(el);

      var key = options.getAttributeFromElement($input);

      var rule = _.extend({}, validation[key]);

      /**
       * We map HTML5 form element validation attributes to rules.
       * 
       * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input
       */

      var helpers = elementToRuleHelpers;
      helpers.ifAnyMatch($input, rule, '[required]', function () {
          rule.required = true;
      });

      var pattern = $input.attr('pattern');
      if (pattern) {
          rule.pattern = new RegExp('^' + pattern + '$');
      }

      helpers.typeAttribute($input, rule, 'number');
      helpers.typeAttribute($input, rule, 'email');
      helpers.typeAttribute($input, rule, 'url');

      helpers.integerAttribute($input, rule, 'min');
      helpers.integerAttribute($input, rule, 'max');
      helpers.integerAttribute($input, rule, 'minlength', 'minLength');
      helpers.integerAttribute($input, rule, 'maxlength', 'maxLength');

      _.each(plugins, function (plugin) {
        plugin($input, rule);
      });

      validation[key] = _.extend({}, rule, validation[key]);

    });

    options.model.validation = validation;

  };


  return exports;
}));
