PinPlay
=======

**TL;DR** Location based music sharing and playing via mobile, email and web app.

## Long Description
PinPlay is a location based music sharing app in which users can post in real time the songs they are listening to from their location. Each time a user posts a song, a marker from their location is dropped with the song's name. Since this is a full duplex web service, users who have the app opened will see the marker being dropped each time someone posts something. In addition to this, users can also upload song files by dragging it to a specific location on the map. Then other users locally can download that file and play it on their devices (the user needs to be physically close to the file to be able to download it, otherwise the user can just see the name of the song/file but not download it).

The idea behind this is to get the sense of what a community is listening to in a physical location, and then if you are into that community, share your interests/songs with other people locally. <assumption> For example, if people use this app in a college/University, new age EDM/party songs are most likely to top, similarly in sub urban places, Country/Pop genre is more likely to be popular. </assumption>

In addition to the web app, there is a mobile app also available (only compiled for Android- yet) and email can too be used. Users can email the song name and their location to an email address and the song's marker will show up in the map. Additionally they can also attach the song file in their email to make the song file available in the map- for the location they specified. 

The music player in the sidebar shows up the songs which are popular in that area [within a 2 miles radius]. The player gets updated as people posts songs on the app.

Not implemented: SMS service for non smartphone users to retrieve the names of the songs popular in the region or post what they are listening to using SMS.

This app is like strictly limited community/location based Twitter for music listeners and lovers.

## Stack
* Created using node.js, WebSocket and MongoDB. 
* Hosted on Digital Ocean VPS. 
* Intel XDK for testing the app for different devices and compiling the web app into a native like phone app.


## APIs Used
* rdio for music.
* SendGrid for emails (will possibly switch to Mandrill for its simplicity and robustness).
* twilio for the SMS feature (if ever implemented).
