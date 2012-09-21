[![endorse](http://api.coderwall.com/bashir/endorsecount.png)](http://coderwall.com/bashir)

# jQuery Scroll Depth
This is a jQuery plugin that keeps an eye on how far down the page a user has scrolled and then reports data back to Google Analytics using the GA Events API. The default behavior reports on the 25%, 50%, 75%, and 100% scroll marks. It also sends an initial "Baseline" event to use as a benchmark.

In addition to the percentage scroll marks you can trigger events based on specific DOM elements. For example you can tell the plugin to report whenever the article comments div is scrolled into view, or whenever the footer is reached.

Lastly, as of version 0.1.2, timing data for each scroll event is recorded and reported to Google Analytics via the [User Timing API](https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingTiming). You can find this data in Google Analytics at Content > Site Speed > User Timings. This will give you data about how many seconds it takes users to reach each scroll point. (Note: Averages can be very misleading. Make sure to dig through the GA UI to turn up more useful data. It's also a good idea to [increase the sample rate](https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._setSiteSpeedSampleRate) from the default 5% to 100%.)

[View the Project Page](http://robflaherty.github.com/jquery-scrolldepth/)

[View the Blog Post](http://www.ravelrumba.com/blog/tracking-scroll-depth-jquery-google-analytics/)

## Usage
```javascript
// Basic
$.scrollDepth();

// With some options
$.scrollDepth({
  minHeight: 2000, // Only track for documents taller than 2000px | Default: 0
  elements: ['#comments', 'footer'] // Track DOM elements | Default: []
  percentage: false, // Don't track depth percentage | Default: true
  eventHandler: reportScrolling, //default is google analytics
});
```
## Requirements
* Google Analytics asynchronous tracking snippet (Optional)
* jQuery 1.7+

## GA Events Warning
<del>GA Events data messes with your bounce rate.</del> As of version 0.1.1 of this plugin, the scroll events no longer impact your bounce rate. If you downloaded the initial 0.1.0 release and you care about the GA displayed bounce rate, update to the latest version.

## Browser Support
Tested in Chrome (18), Firefox (8), Safari (5), Opera (10), IE (7-10). Also tested on iOS, Opera Mobile, and a few Android emulators.

## Contact
If you have any questions please leave a comment on the [associated blog post](http://www.ravelrumba.com/blog/tracking-scroll-depth-jquery-google-analytics/) or find me on Twitter at [@robflaherty](https://twitter.com/#!/robflaherty).

## Changelog
0.1.3 (9/6/12): Added element expansion and optional eventHandler(in place of google analytics)

0.1.2 (5/29/12): Added GA User Timing events to allow time tracking for scroll points.

0.1.1 (4/12/12): Added `opt_noninteraction` option to GA event to avoid impacting bounce rate.

0.1 (4/7/12): Initial release.

## License
Licensed under the MIT and GPL licenses.
