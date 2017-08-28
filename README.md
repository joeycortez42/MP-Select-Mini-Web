# MP Select Mini Web UI

## Overview

Upgrade the Malyan 200 or the Monoprice Select Mini's (V1) Web UI and enable faster Wi-Fi file uploads.

Built using Bootstrap so the UI is mobile-friendly and tablet-friendly.

While you may want to update the UI of the printer, you don't want the web server on the controller working too hard. This upgrade is designed to minimize the amount of data the web server has to serve. You browser will be doing most of the heavy lifting.

![Image of the WebUI](https://raw.githubusercontent.com/nokemono42/MP-Select-Mini-Web/master/screenshot.png)

## Getting Started

1. Download and unzip `MP-Select-Mini-Web` from GitHub.
2. Point a web browser window to your printer's IP address. `http://IPAddressHere`
3. Now browse to the upgrade page. `http://IPAddressHere/up`
4. Click the third "Choose file" and select the "webui.html" file from the folder you unzipped earlier.
5. Click "Upload web."
6. If you see "OK" you are good to go!
7. It's recommended you power cycle your printer at this point.
8. Once your printer is back online, browse to `http://IPAddressHere`. You should now have the upgraded Web UI with full manual control.

## Enable Faster Wi-Fi File Uploads

By default the upgraded Web UI will send `M563 S6` on each refresh to ensure faster Wi-Fi file uploads is enabled.

## Troubleshooting

Did something break? Here's how you can undo the Web UI upgrade.

1. Turn off the printer. Wait about 10 seconds and then turn it back on.
3. Once it's on, go DIRECTLY to `http://IPAddressHere/up`.
4. Just click the "Upload web" button without choosing a file and this will restore the factory web UI.

## Credits

Joey Cortez

Jason Jones (Original Code)

Matthew Upp (Middle Man)

Mario Anthony Galliano (Facebook Group posting with upgrade/downgrade instructions.)

## Upcoming Improvements

* Test on MPSM V2
* Show time lasped / time remaining
* Show filename that is printing
* Change multiplier
* Rename cache.gc file with M566 after upload
* Print done / presentation button. (Gantry away put all the way forward.)
* Query SD card for list of files
* Delete file from SD card
* Print file from SD card
* Rename file from SD card
* Refresh SD card
