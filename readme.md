# jQuery Scroll Depth - Multi tool

This is a fork of a very well build jQuery scroll tracking script. All credits to Rob Flaherty ([@robflaherty](https://twitter.com/robflaherty) for building the original version. 

This scripts keeps an eye on how far down the page a user has scrolled and then reports data back to either Google Analytics, Universal Analytics or Google Tag Manager using the appropriate Events API's. The default behavior reports on the 25%, 50%, 75%, and 100% scroll marks. It also sends an initial "Baseline" event to use as a benchmark.
In addition to the percentage scroll marks you can trigger events based on specific DOM elements. For example you can tell the plugin to report whenever the article comments div is scrolled into view, or whenever the footer is reached.

Lastly, as of version 0.1.2, timing data for each scroll event is recorded and reported to Google Analytics via the [User Timing API](https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingTiming). You can find this data in Google Analytics at Content > Site Speed > User Timings. This will give you data about how many seconds it takes users to reach each scroll point. (Note: Averages can be very misleading. Make sure to dig through the GA UI to turn up more useful data. It's also a good idea to [increase the sample rate](https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._setSiteSpeedSampleRate) from the default 5% to 100%.)

[View the Project Page for ScrollDepth Multi](http://roelwillems.github.io/jquery-scrolldepth/)

[View the original Blog Post](http://www.ravelrumba.com/blog/tracking-scroll-depth-jquery-google-analytics/)

## Usage
```javascript
// Basic
$.scrollDepth({
 percentage: true // Track depth by percentage
});

// With some additional options
$.scrollDepth({
  minHeight: 2000, // Only track for documents taller than 2000px | Default: 0
  elements: ['#comments', 'footer'] // Track DOM elements | Default: []
  percentage: false, // Don't track depth percentage | Default: true
});
```
## Requirements
* The apropriate asynchronous tracking snippets (Google Analytics, Universal Analytics or Google Tag Manager)
* jQuery 1.7+

## GA Events Warning
<del>GA Events data messes with your bounce rate.</del> As of version 0.1.1 of this plugin, the scroll events no longer impact your bounce rate. If you downloaded the initial 0.1.0 release and you care about the GA displayed bounce rate, update to the latest version.

## Google Tag Manager implementation
If you want this plugin to work with the Google Tag Manager (for optimal flexibility you should), you need to configure some macro's and rules within your Google Tag Manager setup.

### Macro's:
This plugin uses the (sort of) standardised macro's to process events. You could uses the macro's below for all Google Analytics events you would like to process through GTM. Of course  you could also build alternate macro's or tags to process the data in a different way (virtual pageviews for instance). 

**Macro name:** event - Category
**Data Layer Variable name:** eventCategory

**Macro name:** event - Action
**Data Layer Variable name:** eventAction

**Macro name:** event - Label
**Data Layer Variable name:** eventLabel

**Macro name:** event - Value
**Data Layer Variable name:** eventValue

**Macro name:** NonInteraction
**Data Layer Variable name:** eventNonInteraction


### Tag:
After this you can add a Google Analytics event (standard Google Analytics tracking code with track type “Event”). With the following macro’s:

**Category** - _{{event - Category}}_

**Action** - _{{event - Action}}_

**Label** - _{{event - Label}}_

**Value** - _{{event - Value}}_

**Non-Interaction Hit** - _{{event - NonInteraction}}_


### Rules:
The tag which sends data to any tracking system implemented within GTM and using the Macro's filled by this plugin should fire when an "event" equals "GAscroll" is detected. This ensures that all dataLayer values are passed to macro's before the tag is fired.


## Browser Support
Tested in Chrome (18), Firefox (8), Safari (5), Opera (10), IE (7-10). Also tested on iOS, Opera Mobile, and a few Android emulators.

## Contact
If you have any questions feel free to get in touch info a-t roelwillems.com

## Changelog

0.1.3 (12/5/13): Updated README.md, incorporated information about the required macro's and GTM Google Analytics Tag

12/5/13: Updated README.md, incorporated information about the required macro's and GTM Google Analytics Tag

Forked (8/15/13): Added support for Universal Analytics and Google Tag Manager events

0.1.2 (5/29/12): Added GA User Timing events to allow time tracking for scroll points.

0.1.1 (4/12/12): Added `opt_noninteraction` option to GA event to avoid impacting bounce rate.

0.1 (4/7/12): Initial release.

## License
Licensed under the MIT and GPL licenses.
