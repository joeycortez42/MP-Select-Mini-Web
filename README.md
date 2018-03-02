# MP Select Mini Web UI

## Overview

Upgrade the Malyan M200 or the Monoprice Select Mini's V1 Web UI and enable faster Wi-Fi file uploads automatically.

Note: Requires UI Controller firmware version 42 or greater to enable a custom Web UI.

This Web UI is built using Bootstrap so it's mobile-friendly and tablet-friendly. Multiple browser connections are supported. GCode responses are sent via Web Sockets so all browser windows will display the printer responses. GCode commands are sent via the REST API, since sending via Web Sockets proved to be unreliable.

![Image of the WebUI](https://raw.githubusercontent.com/nokemono42/MP-Select-Mini-Web/SDCard/images/screenshot.png)


## Getting Started

1. Download and unzip `MP-Select-Mini-Web` from GitHub.
2. Point a web browser window to your printer's IP address. `http://IPAddressHere` This is the default Web UI.
3. Now browse to the upgrade page. `http://IPAddressHere/up`
4. Click the third "Choose file" and select the "webui.html" file from the folder you unzipped earlier.
5. Click "Upload web."
6. If you see "OK" you are good to go!
7. You can power cycle your printer, but it's not necessary.
8. Once your printer is back online, browse to `http://IPAddressHere`. You should now have the upgraded Web UI.


## Enable Faster Wi-Fi File Uploads

By default, the upgraded Web UI will send `M563 S6` on each refresh to ensure faster Wi-Fi file uploads are enabled. This setting doesn't persist after the printer had been powered off.

Note: Since S6 is currently broken due to V2 firmware bug, use `M563 S5`.

M563 parameters can be values between S2 - S6. Transfers happen over telnet, which blocks the sending of any other GCode commands and limits how fast the files can be transferred. The sweet spot seems to be less then 12 MB of GCode. Files larger then that take over 2 minutes to transfer.

| M563 S# | Avg Transfer Speed | Supported On             |
| ------- | -----------------: | ------------------------ |
| S2      |            39 Kbps | Same as Firmware Default |
| S3      |            63 Kbps | V1 / V2? / Delta         |
| S4      |            91 Kbps | V1 / V2? / Delta         |
| S5      |           103 Kbps | V2?                      |
| S6      |           112 Kbps | V1                       |


## SD Card Functions

The file listing loads when the "refresh" icon is clicked. File names in the Web UI will be limited to 21 characters. The printer can support longer names, but it cuts off the extension and name after 24 characters.

Files that are uploaded will be renamed from "cache.gc" to the original file name. If you are re-uploading a previous file, the old file is deleted first, then the file is renamed. 

The print icon does two things: it selects the file `M32` for print, and tells the printer to print it `M24`, but it won't set the target tempatures. Pre-heat before requesting to print a file. Once the extruder and bed are at the target temperatures, the printer LCD will display the printing screen.

The delete icon will delete the file, `M30`, and refresh the file listing.


## Offline Usage

While you may want to update the UI of the printer, you don't want the web server on the controller working too hard. This upgrade is designed to minimize the amount of data the web server has to serve. You browser will be doing most of the heavy lifting.

But if you want to use the Web UI without an active internet connection, delete the `webui.html` file and rename `webui-offline.html` to `webui.html`.


## Troubleshooting

Did something break? Here's how you can undo the Web UI upgrade.

1. Turn off the printer. Wait about 10 seconds and then turn it back on.
2. Once it's on and connected to Wi-Fi, browse to `http://IPAddressHere/up`.
3. Just click the "Upload web" button without choosing a file and this will restore the factory Web UI.


## Donation
If this project helps, you can buy me a cup of coffee. :grimacing: :coffee: 

[![PayPal button](http://rawgit.com/twolfson/paypal-github-button/master/dist/button.svg)](https://www.paypal.me/thejoeycortez/5)


## Credits

Joey Cortez

Jason Jones (Original Code)

Matthew Upp (Middle Man)

Mario Anthony Galliano (Facebook Group posting with upgrade/downgrade instructions.)


## Upcoming Improvements

* Test on MP Select Mini V2
* Create V2 Branch
* Create Delta Mini repo
* Change multiplier
* Reset device state. If inquiry not able to load, reset page bool values. (Same as page refresh)