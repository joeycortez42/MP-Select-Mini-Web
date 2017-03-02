# MP Select Mini Web UI

## Overview

Upgrade the Malyan 200 or the Monoprice Select Mini's Web UI and enable faster Wi-Fi file transfers. Built using Bootstrap so the UI is mobile-friendly and tablet-friendly.

While you want to update the UI of the printer, you don't want the web server on the controller working too hard. This upgrade is designed to minimize the amount of data the web server has to serve. You browser will be doing move of the heavy lifting.

## Getting Started

1. Download and unzip `MP-Select-Mini-Web` from GitHub.
2. Point a web browser window to your printer's IP address. `http://IPAddressHere`
3. Now browse to the upgrade page. `http://IPAddressHere/up`
4. On the upgrade page, there are three options. We are only concerned with the last one, "Upload web." DO NOT CLICK THIS YET.
5. On the same line as "Upload web" click "Choose file" and select the "webui.html" file from the folder you unzipped earlier.
6. NOW you can click "Upload web."
6. If things worked, the response will display one word only. If you see "OK" you are good to go!
7. It's recommended you power cycle your printer at this point.
8. Once your printer is back online, browse to `http://IPAddressHere`. You should now have the upgraded web UI with full manual control.

## Enable Faster Wifi File Transfers

The final step is to speed up your Wi-Fi uploading by pasting, `M563 S6` in the "send GCode to printer" box and hitting send. You will need to send that GCode after every power cycle, though.

## Troubleshooting

Did something break? Here's how you can undo the Web UI upgrade.

1. Turn off the printer. Wait about 10 seconds, and then turn it back on.
3. Once it's on go DIRECTLY to `http://IPAddressHere/up`.
4. Just click the "Upload web" button without choosing a file and it will restore the factory web UI.

## Credits

Joey Cortez

Jason Jones (Original Code)

Matthew Upp (Middle Man / Beta Tester)

Mario Anthony Galliano (Facebook posting with upgrade/downgrade instructions.)

## To Dos

* Disable motors button
* Show time lasped / time remaining
* Show filename that is printing
* Change multiplier
* Rename cache.gc file with M566 after upload
* Print done / presentation button. (Gantry away put all the way forward.)
* Disengage motors
* Query SD card for list of files
* Delete file from SD card
* Print file from SD card
* Rename file from SD card
* Refresh SD card
