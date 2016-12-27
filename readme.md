# Scroll Depth
Scroll Depth is a Google Analytics plugin that tracks how far users are scrolling. The plugin provides native support for Universal Analytics, Classic Google Analytics, and Google Tag Manager. It can also be used with any analytics service that supports events.

**[All information is available on the Project Page](http://projects.parsnip.io/scroll-depth/)**

## Forks
* There's a [WordPress plugin](https://wordpress.org/plugins/wp-scroll-depth/) maintained by Lon Koenig.
* There's a [non-jQuery fork](https://github.com/leighmcculloch/gascrolldepth.js) maintained by @leighmcculloch.

## Contributing
Bug reports and code contributions are welcome. Please see [contributing.md](https://github.com/robflaherty/jquery-scrolldepth/blob/master/contributing.md).

## Testing
There's a test HTML file that mocks the Google Analytics functions and writes the GA Event data to the console.

## Contact
If you have any questions you can find me on Twitter at [@robflaherty](https://twitter.com/robflaherty). If you need help fixing something, **please provide a URL**.

## Changelog
1.0 (12/8/16): Added support for customer tracker name and custom dataLayer name.

0.9.1 (4/28/16): Added support for Universal Module Definition (UMD).

0.9 (11/19/15): Removed Baseline event. Added methods to add elements, remove elements, and reset the current scroll tracking state.

0.8 (7/18/15): Added option for custom GA global. Added '__gaTracker' as auto-detected global. Added option for overriding GTM.

0.7.2 (6/8/15): Fixed bug: https://github.com/robflaherty/jquery-scrolldepth/issues/62

0.7 (11/26/14): Added custom callback for sending scroll events to non-GA services

0.6 (7/18/14): https://github.com/robflaherty/jquery-scrolldepth/issues/36

0.5 (3/1/14): Added Pixel Depth option. Added option to turn off UserTiming. Removed test mode option.

0.4.1 (2/13/14): Fixed GTM firing double events

0.4 (12/23/13): Added support for Google Tag Manager

0.3 (11/21/13): Added throttling of scroll event callback for better performance.

0.2 (11/19/13): Added support for Universal Analytics.

0.1.2 (5/29/12): Added GA User Timing events to allow time tracking for scroll points.

0.1.1 (4/12/12): Added `opt_noninteraction` option to GA event to avoid impacting bounce rate.

0.1 (4/7/12): Initial release.

## License
Licensed under the MIT and GPL licenses.
