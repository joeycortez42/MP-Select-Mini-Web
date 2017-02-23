# MP Select Mini Web UI

## Overview

Upgrade the Select Mini's Web UI and enable faster wifi file transfers.

## Getting Started

1. Download and unzip `MP-Select-Mini-Web` from GitHub.
2. Point a web browser window to your printer's IP address. `http://IPAddressHere`
3. Now browser to the upgrade page. `http://IPAddressHere/up`
4. On this upgrade page, there are three options. We are only concerned with the last one "Upload web." DO NOT CLICK THIS YET.
5. Directly across from this button saying chose file. Click this button and select webui.html from the folder you unzipped earlier.
6. NOW you can click the button to the lowest right that says "Upload web".
6. If things worked, the response will display one word only. "OK" If you see that your good to go! 
7. Usually it is good to power cycle your printer at this point.
8. Once your printer is back on-line, browse to `http://IPAddressHere`. You should now have the upgraded web ui with full manual control. 

## Enable Faster Wifi File Transfers

The final step is to speed up your wifi uploading by pasting, `M563 S6 ;` in the "send gCode to printer" box and hitting send.

## Troubleshooting

Something broke? Here's how you can undo the Web UI upgrade.

1. Turn off the printer. Wait about 10 seconds, and then turn it back on.
3. Once its on go DIRECTLY to `http://IPAddressHere/up`.
4. Just click the "upload web" button with out chosing a file and it will restore the factory web ui.

## Credits

Jason Jones (Original Code)
Matthew Upp (Middle Man / Beta Tester)
Mario Anthony Galliano (Facebook posting with upgrade/downgrade instructions.)
