backbone.validation.form
========================

Automate [Backbone.Validation] rules with HTML5 form input attributes.

Supports:
* `required`
* `input[type=number]`
* `input[type=email]`
* `input[type=url]`
* `input[pattern]`
* `input[min]`
* `input[max]`
* `input[minlength]`
* `input[maxlength]`

Refer to: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input


## Install

```sh
$ bower install --save backbone.validation.form
```

Include `src/backbone.validation.form.js` in your code.


## Use

Call `update` after rendering the View the wraps your form:

```js
var MyFormView = Backbone.View.extend({

  render: function () {
    // ...rendering...
    
    BackboneValidationForm.update(this);
    
    return this;
  }

});
```

### Options

Pass options as follows: `BackboneValidationForm.update(view, options);`


`selector`: Optional. A jQuery selector (or array thereof) to get input elements. Defaults to `input`, `textarea`, and `select` element with `name` attributes, except buttons.

`exclude` (`function($el)`): Optional. A function to filter out matched elements. By default, excludes any element with `novalidate` attribute, or with such an ancestor.

`getAttributeFromElement` (`function($el)`): Optional. A function to get a model attribute name from a matched element. By default, uses the `name` attribute.

`model` (`Backbone.Model`): Optional. A model to use instead of `view.model`.



[backbone.validation]: http://thedersen.com/projects/backbone-validation/

