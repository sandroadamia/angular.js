'use strict';

goog.require('angular.core.module');
goog.require('angular.annotate');

goog.provide('angular.core.$Anchor');


/**
 * An Anchor is an instance of a hole. Anchors designate where child Blocks can be added in parent Block. Anchors
 * wrap a DOM element, and act as references which allows more blocks to be added.
 *
 *
 * @param {Array.<Node>} elements An array of elements which the Anchor wraps. (Even thought Anchor takes an array of
 *   elements, Anchors always wrap exactly one element.)
 * @param {*} templates
 * @constructor
 * @implements {angular.core.ElementWrapper};
 */
angular.core.Anchor = function ($rootScope, elements, templates) {
  this.elements = elements;
  this.next = this.previous = null;
  this.templates = isFunction(templates) ? {'': templates} : templates;

  var existing = this.existing = [];

  ASSERT(elements && elements.length);

  // This is a bit of a hack.
  // We need to run after the first watch, that means we have to wait for watch, and then schedule $evalAsync.
  var deregisterWatch = $rootScope.$watch(function() {
    deregisterWatch();
    $rootScope.$evalAsync(function() {
      while(existing.length) {
        existing.shift().remove();
      }
    });
  });
};
angular.annotate.$inject(['$rootScope'], angular.core.Anchor, true);

/**
 * @param {angular.core.Block} block
 */
angular.core.Anchor.prototype.addExisting = function(block) {
  this.existing.push(block);
};

/**
 * @param {string=} type
 * @return {angular.core.Block}
 */
angular.core.Anchor.prototype.newBlock = function(type) {
  var template;

  if (this.existing.length) {
    return this.existing.shift();
  } else {
    template = this.templates[type || ''];
    template = template && template();
  }
  return template;
};

/**
 * Bound anchor constructor.
 * @Constructor
 * @extends {angular.core.Anchor}
 */
angular.core.$Anchor = function(elements, templates) {};


