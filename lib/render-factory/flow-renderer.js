'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Abstract class for a renderer.
 */
var FlowRenderer = function () {
  /**
   * Constructor of the class. The settings must include the message builder
   * and the flow-template.
   * 
   * @param { Object } settings Settings for constructing the class.
   */
  function FlowRenderer(settings) {
    _classCallCheck(this, FlowRenderer);

    this.settings = settings;
    this.builder = this.settings.builder;
    this.template = this.settings.template;
  }

  /**
   * Translate the given card, to the given locale, using the variables.
   * 
   * @param { Object } card Instance of the card to be translated.
   * @param { String } locale Locale code of the target language.
   * @param { Object } variables Variables for templating the card.
   */


  _createClass(FlowRenderer, [{
    key: 'translate',
    value: function translate(card, locale, variables) {
      return this.template.translate(card, locale, variables);
    }

    /**
     * Transform the given card to the message builder.
     * 
     * @param { Object } session Chat session for building the message.
     * @param { Object } card Card to be transformed.
     */

  }, {
    key: 'transform',
    value: function transform(session, card) {
      throw new Error('This abstract method must be overrided');
    }

    /**
     * Indicates if the card is a prompt.
     * 
     * @param { Object } card Input card.
     * @returns { Boolean } True if the card is a prompt, false otherwise. 
     */

  }, {
    key: 'containsPrompt',
    value: function containsPrompt(card) {
      return card.prompt && card.prompt !== '';
    }
  }, {
    key: 'launchPrompt',
    value: function launchPrompt(session, card) {
      if (card.prompt === 'choice') {
        if (_lodash2.default.isString(card.optionsStr)) {
          var tokens = card.optionsStr.split('|');
          card.options = [];
          for (var j = 0; j < tokens.length; j++) {
            card.options.push({ tag: tokens[j], text: tokens[j] });
          }
        }
        var options = [];
        for (var i = 0; i < card.options.length; i++) {
          options.push(card.options[i].text);
        }
        var style = card.style ? { listStyle: this.builder.ListStyle[card.style] } : undefined;
        return this.builder.Prompts.choice(session, card.text, options, style);
      } else {
        return this.builder.Prompts[card.prompt](session, card.text);
      }
    }

    /**
     * Render a card to the given session.
     * 
     * @param { Object } session Chat session for building the message.
     * @param { Object } card Instance of the card to be rendered.
     * @param { String } locale Locale code of the target language.
     * @param { Object } variables Variables for templating the card.
     */

  }, {
    key: 'render',
    value: function render(session, card, locale, variables) {
      var translatedCard = this.translate(card, locale, variables);
      session.dialogData.lastCard = translatedCard;
      var result = this.transform(session, translatedCard);
      if (this.containsPrompt(translatedCard) && translatedCard.type !== 'prompt') {
        this.launchPrompt(session, translatedCard);
      }
      return result;
    }
  }]);

  return FlowRenderer;
}();

exports.default = FlowRenderer;