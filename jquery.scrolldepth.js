/*!
 * jquery.scrolldepth.js | v0.1.2
 * Copyright (c) 2012 Rob Flaherty (@robflaherty)
 * Licensed under the MIT and GPL licenses.
 */
;(function ( $, window, document, undefined ) {
  
  "use strict";

  var defaults = {
    elements: [],
    minHeight: 0,
    offset: 0, // Not used yet
    percentage: true,
    testing: false
  },

  $window = $(window),
  cache = [];

  /*
   * Plugin
   */

  $.scrollDepth = function(options) {
    
    var startTime = +new Date;

    options = $.extend({}, defaults, options);

    // Return early if document height is too small
    if ( $(document).height() < options.minHeight ) {
      return;
    }

    // Establish baseline (0% scroll)
    sendEvent('Percentage', 'Baseline');

    /*
     * Functions
     */

    function sendEvent(action, label, timing) {
      if (!options.testing) {

        if ( typeof(ga) == "function" || typeof(ga) == "object" ) {
          ga('send', 'event', 'Scroll Depth', action, label, 1, {'nonInteraction': 1});
        } else if ( typeof(_gaq) == "function" || typeof(_gaq) == "object" ) {
          _gaq.push(['_trackEvent', 'Scroll Depth', action, label, 1, true]);
        }

        if (arguments.length > 2) {
          if ( typeof(ga) == "function" || typeof(ga) == "object" ) {
            ga('send', 'timing', 'Scroll Depth', action, timing, label);
          } else if ( typeof(_gaq) == "function" || typeof(_gaq) == "object" ) {
            _gaq.push(['_trackTiming', 'Scroll Depth', action, timing, label, 100]);
          }
        }

      } else {
        $('#console').html(action + ': ' + label);
      }
    }

    function calculateMarks(docHeight) {
      return {
        '25%' : parseInt(docHeight * 0.25, 10),
        '50%' : parseInt(docHeight * 0.50, 10),
        '75%' : parseInt(docHeight * 0.75, 10),
        // 1px cushion to trigger 100% event in iOS
        '100%': docHeight - 1
      };
    }

    function checkMarks(marks, scrollDistance, timing) {
      // Check each active mark
      $.each(marks, function(key, val) {
        if ( $.inArray(key, cache) === -1 && scrollDistance >= val ) {
          sendEvent('Percentage', key, timing);
          cache.push(key);
        }
      });
    }

    function checkElements(elements, scrollDistance, timing) {
      $.each(elements, function(index, elem) {
        if ( $.inArray(elem, cache) === -1 && $(elem).length ) {
          if ( scrollDistance >= $(elem).offset().top ) {
            sendEvent('Elements', elem, timing);
            cache.push(elem);
          }
        }
      });
    }

    /*
     * Scroll Event
     */

    $window.on('scroll.scrollDepth', function() {

      /*
       * We calculate document and window height on each scroll event to
       * account for dynamic DOM changes.
       */

      var docHeight = $(document).height(),
        winHeight = window.innerHeight ? window.innerHeight : $window.height(),
        scrollDistance = $window.scrollTop() + winHeight,

        // Offset not being used yet
        offset = parseInt(winHeight * (options.offset / 100), 10),

        // Recalculate percentage marks
        marks = calculateMarks(docHeight),

        // Timing
        timing = +new Date - startTime;

      // If all marks already hit, unbind scroll event
      if (cache.length >= 4 + options.elements.length) {
        $window.off('scroll.scrollDepth');
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
    });

  };

})( jQuery, window, document );
