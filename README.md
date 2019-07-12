# GetVideo

Youtube video downloader.

Uses youtube-dl and configured to download the highest quality.

Output is two files in a required folder name of your choosing.

The files outputed are:
 **video only**: `mp4`
 **audio only**: `m4a`

A program such as Adobe Primiere is recommended to recombine the two halves.

In order to begin the program.
Please first download the repository by cloning or in zip format.
Install dependencies:

`yarn install`

Then:

`yarn start`

An optional **makefile** can be placed in a directory of your choice and the program can be initialized in Terminal by command: `make getvideo`.

In case the port is already in use. The **makefile** has a port kill switch using command: `make killit`. 

This project is open sourced and does not have a license for use. Enjoy!

# TODOS

 - [ ] Add quanlity selection
 - [ ] Add Audio or video Only
