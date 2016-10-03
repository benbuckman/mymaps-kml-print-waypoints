# mymaps-kml-print-waypoints

For printing the waypoints (icons + titles + descriptions) from a [Google "My Maps"][mymaps] custom map.

(Because the built-in Print Map feature does not include the waypoint descriptions.)

Created for a trip to [Cuba][cuba], where we couldn't rely on internet access or download Google Maps offline. 


## How to use

Export your custom map to a KML or KMZ file.

(KMZ is just a zip file, use `unzip` to extract.)

`npm install -g mymaps-kml-print-waypoints`

`mymaps-kml-print-waypoints --kml=... --html=... [--images=...]`.

(See more details at `mymaps-kml-print-waypoints --help`.)

Intended as a one-off script, not to be used in a live application.

(So, for example, all file IO is synchronous.)

Enjoy


[mymaps]: https://www.google.com/mymaps
[cuba]: http://www.stephandben.com/2016/05/cuba-havana-itinerary.html
