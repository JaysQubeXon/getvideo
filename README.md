# GetVideo

Youtube video downloader.

Uses youtube-dl and configured to download the highest quality.

You can select between 4 download types:
 - `single file`: Downloads best quality in single file
 - `separate audio & video`: Downloasd audio (m4a) and video (mp4)
 - `audio only`: Downloads audio in m4a format without video
 - `video only`: Downloads video in mp4 format without audio


A program such as Adobe Primiere is recommended to recombine the two halves. In a future release, ffmpeg would be required for combining files.

In order to begin the program.
Please download the repository by cloning or in zip format.
Install dependencies:

`yarn install`

You will need to install `youtube-dl` on your computer by:
MacOS: `brew install youtube-dl`
Windows: [Download link](https://yt-dl.org/latest/youtube-dl.exe)

After both are installed, you can start up the server and UI:

`yarn start`

An optional **makefile** can be placed in a directory of your choice and the program can be initialized in Terminal by command: `make getvideo`.

In case the port is already in use. The **makefile** has a port kill switch using command: `make killit`. 

This project is open sourced and does not have a license for use. Enjoy!

# TODOS

 - [ ] Add quality selection
 - [x] Add Audio or video Only

https://www.youtube.com/watch?v=hICIjwaN3VM