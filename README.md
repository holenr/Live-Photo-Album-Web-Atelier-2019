# live_photo_album_wa_2019_repload
As basis for the final exam of the Web Atelier September 2019. Reupload version 1.0


To run:

Make sure mongodb is running in another console window:
 > mongod
 
Install/ update node modules:
> yarn install

Run in console from repository live_photo_album_wa_2019:
> yarn run start


Previous Versions: v.0.1, v.0.2, v.0.3, v.0.4
Current Version: v.1.0

Features:

1.) User registration/login

2.) Upload a picture - POST /{user}/pictures

3.) Display a list of picture thumbnails uploaded by a user - GET /{user}/pictures
    
4.) Clicking on the picture thumbnail will open up the picture full screen - GET /{user}/pictures/{id} (Added v.0.2)
    
5.) Remove pictures both from API and from the list of picture view - DELETE /{user}/pictures/{id} 
    
6.) Display a random picture from any user (refreshing the page should change the picture) - GET /random

7.) Display an interactive slideshow remotely controlled from other browsers   
