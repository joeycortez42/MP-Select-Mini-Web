# MP Select Mini Web UI

## Overview

Upgrade the Malyan M200 or the Monoprice Select Mini's V1 Web UI and enable faster Wi-Fi file uploads automatically. For V2, download the [V2 branch](https://github.com/nokemono42/MP-Select-Mini-Web/tree/v2).

Requires UI Controller firmware version 42 to enable the custom Web UI.

This Web UI is built using Bootstrap so its mobile-friendly and tablet-friendly. Multiple browser connections are supported. The GCode commands are sent via Web Sockets so all browser windows will display the printer responses.

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

By default the upgraded Web UI will send `M563 S6` on each refresh to ensure faster Wi-Fi file uploads is enabled. This setting doesn't persist after the printer had been powered off.

Note: Since S6 is currently broken due to V2 firmware bug the V2 uses `M563 S5`. See [V2 branch](https://github.com/nokemono42/MP-Select-Mini-Web/tree/v2).

 S values can be 2 - 6. Transfers happen over telnet which blocks the sending of any other GCode commands and limits how fast the files can be transfered. The sweet spot seems to be less then 12 MB of GCode. Files larger then that take over 2 minutes to transfer.

| M563 S# | Avg Transfer Speed | Supported On     |
| ------- | -----------------: | ---------------- |
| S2      |            39 Kbps | Firmware Default |
| S3      |            63 Kbps | All              |
| S4      |            90 Kbps | All              |
| S5      |           102 Kbps | Only V2 / Delta  |
| S6      |           112 Kbps | Only V1          |

## Offline Usage

While you may want to update the UI of the printer, you don't want the web server on the controller working too hard. This upgrade is designed to minimize the amount of data the web server has to serve. You browser will be doing most of the heavy lifting.

But if you want to use the Web UI without an active Internet connection, delete the `webui.html` file and rename `webui-offline.html` to `webui.html`.


## Troubleshooting

Did something break? Here's how you can undo the Web UI upgrade.

1. Turn off the printer. Wait about 10 seconds and then turn it back on.
3. Once it's on and connected to Wi-Fi browse to `http://IPAddressHere/up`.
4. Just click the "Upload web" button without choosing a file and this will restore the factory web UI.


## Credits

Joey Cortez

Jason Jones (Original Code)

Matthew Upp (Middle Man)

Mario Anthony Galliano (Facebook Group posting with upgrade/downgrade instructions.)


## Upcoming Improvements

* Test on MPSM V2
* Change multiplier
* Show time lasped / time remaining
* Show filename that is printing
* Rename cache.gc file with M566 after upload
* Query SD card for list of files M20
*   Delete file from SD card M30
*   Print file from SD card M24
*   Pause print M25
