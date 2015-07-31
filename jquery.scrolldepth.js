/*!
 * @preserve
 * jquery.scrolldepth.js | v0.8
 * Copyright (c) 2015 Rob Flaherty (@robflaherty)
 * Licensed under the MIT and GPL licenses.
 */
;(function ( $, window, document, undefined ) {

  "use strict";

  var defaults = {
    minHeight: 0,
    elements: [],
    percentage: true,
    userTiming: true,
    pixelDepth: true,
    nonInteraction: true,
    gaGlobal: false,
    gtmOverride: false
  };

  var cache = [],
    lastPixelDepth = 0,
    universalGA,
    classicGA,
    gaGlobal,
    standardEventHandler;

  /*
   * Reliably get the document height.
   * Borrowed from:
   * jQuery
   * https://jquery.org/
   * Ref: https://github.com/jquery/jquery/blob/a644101ed04d0beacea864ce805e0c4f86ba1cd1/src/dimensions.js#L33
   * Copyright: jQuery Foundation and other contributors
   * License: https://github.com/jquery/jquery/blob/a644101ed04d0beacea864ce805e0c4f86ba1cd1/LICENSE.txt
   */

  function getDocumentHeight() {
    return Math.max(
      document.documentElement["scrollHeight"], document.body["scrollHeight"],
      document.documentElement["offsetHeight"], document.body["offsetHeight"],
      document.documentElement["clientHeight"]
    );
  }

  /*
   * Reliably get the window height.
   * Ref: http://www.w3schools.com/js/js_window.asp
   */

  function getWindowHeight() {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  }

  /*
   * Reliably get the page y-axis offset due to scrolling.
   * Ref: https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
   */

  function getPageYOffset() {
    return window.pageYOffset || (document.compatMode === "CSS1Compat" ? document.documentElement.scrollTop : document.body.scrollTop);
  }

  /*
   * Reliably get the element's y-axis offset to the document top.
   * Ref: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
   */

  function getElementYOffsetToDocumentTop(element) {
    return element.getBoundingClientRect().top + getPageYOffset();
  }

  /*
   * Polyfill for addEventListener and removeEventListener, for the event types required for this library.
   * Not a full polyfill, as this has been reduced to what's needed here.
   * Ref: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   */

  (function() {
    if (!Element.prototype.addEventListener) {
      var eventListeners=[];
      var addEventListener=function(type,listener /*, useCapture (will be ignored) */) {
        var self=this;
        var wrapper=function(e) {
          e.target=e.srcElement;
          e.currentTarget=self;
          if (listener.handleEvent) {
            listener.handleEvent(e);
          } else {
            listener.call(self,e);
          }
        };
        this.attachEvent("on"+type,wrapper);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
      };
      var removeEventListener=function(type,listener /*, useCapture (will be ignored) */) {
        var counter=0;
        while (counter<eventListeners.length) {
          var eventListener=eventListeners[counter];
          if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
            this.detachEvent("on"+type,eventListener.wrapper);
            eventListeners.splice(counter, 1);
            break;
          }
          ++counter;
        }
      };
      Element.prototype.addEventListener=addEventListener;
      Element.prototype.removeEventListener=removeEventListener;
      if (HTMLDocument) {
        HTMLDocument.prototype.addEventListener=addEventListener;
        HTMLDocument.prototype.removeEventListener=removeEventListener;
      }
      if (Window) {
        Window.prototype.addEventListener=addEventListener;
        Window.prototype.removeEventListener=removeEventListener;
      }
    }
  })();

  /*
   * Plugin
   */

  $.scrollDepth = function(options) {

    var startTime = +new Date;

    options = $.extend({}, defaults, options);

    // Return early if document height is too small
    if ( getDocumentHeight() < options.minHeight ) {
      return;
    }

    /*
     * Determine which version of GA is being used
     * "ga", "__gaTracker", _gaq", and "dataLayer" are the possible globals
     */

    if (options.gaGlobal) {
      universalGA = true;
      gaGlobal = options.gaGlobal;
    } else if (typeof ga === "function") {
      universalGA = true;
      gaGlobal = 'ga';
    } else if (typeof __gaTracker === "function") {
      universalGA = true;
      gaGlobal = '__gaTracker';
    }

    if (typeof _gaq !== "undefined" && typeof _gaq.push === "function") {
      classicGA = true;
    }

    if (typeof options.eventHandler === "function") {
      standardEventHandler = options.eventHandler;
    } else if (typeof dataLayer !== "undefined" && typeof dataLayer.push === "function" && !options.gtmOverride) {

      standardEventHandler = function(data) {
        dataLayer.push(data);
      };
    }

    if (options.percentage) {
      // Establish baseline (0% scroll)
      sendBaseline('Percentage');
    } else if (options.elements) {
      sendBaseline('Elements');
    }

    /*
     * Functions
     */

    /*
     * Putting this in a separate function because the Baseline event may soon be removed entirely
     */
    function sendBaseline(action, label) {

      if (standardEventHandler) {

        standardEventHandler({'event': 'ScrollDistance', 'eventCategory': 'Scroll Depth', 'eventAction': action, 'eventLabel': 'Baseline', 'eventValue': 1, 'eventNonInteraction': true });

      } else {

        if (universalGA) {

          window[gaGlobal]('send', 'event', 'Scroll Depth', action, 'Baseline', 1, {'nonInteraction': true });

        }

        if (classicGA) {

          _gaq.push(['_trackEvent', 'Scroll Depth', action, 'Baseline', 1, true]);

        }

      }

    }

    function sendEvent(action, label, scrollDistance, timing) {

      if (standardEventHandler) {

        standardEventHandler({'event': 'ScrollDistance', 'eventCategory': 'Scroll Depth', 'eventAction': action, 'eventLabel': label, 'eventValue': 1, 'eventNonInteraction': options.nonInteraction});

        if (options.pixelDepth && arguments.length > 2 && scrollDistance > lastPixelDepth) {
          lastPixelDepth = scrollDistance;
          standardEventHandler({'event': 'ScrollDistance', 'eventCategory': 'Scroll Depth', 'eventAction': 'Pixel Depth', 'eventLabel': rounded(scrollDistance), 'eventValue': 1, 'eventNonInteraction': options.nonInteraction});
        }

        if (options.userTiming && arguments.length > 3) {
          standardEventHandler({'event': 'ScrollTiming', 'eventCategory': 'Scroll Depth', 'eventAction': action, 'eventLabel': label, 'eventTiming': timing});
        }

      } else {

        if (universalGA) {

          window[gaGlobal]('send', 'event', 'Scroll Depth', action, label, 1, {'nonInteraction': options.nonInteraction});

          if (options.pixelDepth && arguments.length > 2 && scrollDistance > lastPixelDepth) {
            lastPixelDepth = scrollDistance;
            window[gaGlobal]('send', 'event', 'Scroll Depth', 'Pixel Depth', rounded(scrollDistance), 1, {'nonInteraction': options.nonInteraction});
          }

          if (options.userTiming && arguments.length > 3) {
            window[gaGlobal]('send', 'timing', 'Scroll Depth', action, timing, label);
          }

        }

        if (classicGA) {

          _gaq.push(['_trackEvent', 'Scroll Depth', action, label, 1, options.nonInteraction]);

          if (options.pixelDepth && arguments.length > 2 && scrollDistance > lastPixelDepth) {
            lastPixelDepth = scrollDistance;
            _gaq.push(['_trackEvent', 'Scroll Depth', 'Pixel Depth', rounded(scrollDistance), 1, options.nonInteraction]);
          }

          if (options.userTiming && arguments.length > 3) {
            _gaq.push(['_trackTiming', 'Scroll Depth', action, timing, label, 100]);
          }

        }

      }

    }

    function calculateMarks(docHeight) {
      return {
        '25%' : parseInt(docHeight * 0.25, 10),
        '50%' : parseInt(docHeight * 0.50, 10),
        '75%' : parseInt(docHeight * 0.75, 10),
        // 1px cushion to trigger 100% event in iOS
        '100%': docHeight - 5
      };
    }

    function checkMarks(marks, scrollDistance, timing) {
      // Check each active mark
      $.each(marks, function(key, val) {
        if ( $.inArray(key, cache) === -1 && scrollDistance >= val ) {
          sendEvent('Percentage', key, scrollDistance, timing);
          cache.push(key);
        }
      });
    }

    function checkElements(elements, scrollDistance, timing) {
      $.each(elements, function(index, elem) {
        if ( $.inArray(elem, cache) === -1 ) {
          var elemNode = document.querySelector(elem);
          if ( elemNode ) {
            var elemYOffset = getElementYOffsetToDocumentTop(elemNode);
            if ( scrollDistance >= elemYOffset ) {
              sendEvent('Elements', elem, scrollDistance, timing);
              cache.push(elem);
            }
          }
        }
      });
    }

    function rounded(scrollDistance) {
      // Returns String
      return (Math.floor(scrollDistance/250) * 250).toString();
    }

    /*
     * Throttle function borrowed from:
     * Underscore.js 1.5.2
     * http://underscorejs.org
     * (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     * Underscore may be freely distributed under the MIT license.
     */

    function throttle(func, wait) {
      var context, args, result;
      var timeout = null;
      var previous = 0;
      var later = function() {
        previous = new Date;
        timeout = null;
        result = func.apply(context, args);
      };
      return function() {
        var now = new Date;
        if (!previous) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
          clearTimeout(timeout);
          timeout = null;
          previous = now;
          result = func.apply(context, args);
        } else if (!timeout) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
    }

    /*
     * Scroll Event
     */

    var scrollEventHandler = throttle(function() {
      /*
       * We calculate document and window height on each scroll event to
       * account for dynamic DOM changes.
       */

      var docHeight = getDocumentHeight(),
        winHeight = getWindowHeight(),
        scrollDistance = getPageYOffset() + winHeight,

        // Recalculate percentage marks
        marks = calculateMarks(docHeight),

        // Timing
        timing = +new Date - startTime;

      // If all marks already hit, unbind scroll event
      if (cache.length >= 4 + options.elements.length) {
        window.removeEventListener('scroll', scrollEventHandler);
        return;
      }

      // Check specified DOM elements
      if (options.elements) {
        checkElements(options.elements, scrollDistance, timing);
      }

      // Check standard marks
      if (options.percentage) {
        checkMarks(marks, scrollDistance, timing);
      }
    }, 500);

    window.addEventListener('scroll', scrollEventHandler, false);

  };

})( jQuery, window, document );
