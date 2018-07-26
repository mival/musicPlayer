/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    success: function() {
        console.log(arguments);
    },
    error: function() {
        console.error(arguments);
    },
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onMusicEvent(action, media){

        const message = JSON.parse(action).message;
        switch(message) {
            case 'music-controls-next':
                // Do something
                break;
            case 'music-controls-previous':
                // Do something
                break;
            case 'music-controls-pause':
                // Do something
                media.pause();
                MusicControls.updateIsPlaying(false)
                break;
            case 'music-controls-play':
                media.play();
                MusicControls.updateIsPlaying(true)
                // Do something
                break;
            case 'music-controls-destroy':
                // Do something
                break;

            // External controls (iOS only)
            case 'music-controls-toggle-play-pause' :
                // Do something
                break;
            case 'music-controls-seek-to':
                const seekToInSeconds = JSON.parse(action).position;
                MusicControls.updateElapsed({
                    elapsed: seekToInSeconds,
                    isPlaying: true
                });
                // Do something
                break;

            // Headset events (Android only)
            // All media button events are listed below
            case 'music-controls-media-button' :
                // Do something
                break;
            case 'music-controls-headset-unplugged':
                // Do something
                break;
            case 'music-controls-headset-plugged':
                // Do something
                break;
            default:
                break;
        }
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        var _this = this;
        this.media = new Media('assets/10.mp3', this.success, this.error, function() {
            console.info(arguments);
        });
        
        var mediaTimer = setInterval(function () {
         // get media position
         _this.media.getCurrentPosition(
             // success callback
             function (position) {
                 if (position > -1) {
                     MusicControls.updateElapsed({
                         elapsed: Math.round(position), // seconds
                         isPlaying: true
                     });
                 }
             },
             // error callback
             function (e) {
                 console.log("Error getting pos=" + e);
             }
         );
         }, 1000);
        this.receivedEvent('deviceready');
    },



    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    initMedia: function(){
        var _this = this;
        MusicControls.create({
         track       : 'Time is Running Out',        // optional, default : ''
         artist      : 'Muse',                        // optional, default : ''
         cover       : 'albums/absolution.jpg',        // optional, default : nothing
         // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
         //             or a remote url ('http://...', 'https://...', 'ftp://...')
         isPlaying   : false,                            // optional, default : true
         dismissable : false,                            // optional, default : false
         
         // hide previous/next/close buttons:
         hasPrev   : false,        // show previous button, optional, default: true
         hasNext   : false,        // show next button, optional, default: true
         hasClose  : false,        // show close button, optional, default: false
         
         // iOS only, optional
         album       : 'Absolution',     // optional, default: ''
         duration : Math.round(app.media.getDuration()), // optional, default: 0
         elapsed : 0, // optional, default: 0
         hasSkipForward : false, //optional, default: false. true value overrides hasNext.
         hasSkipBackward : false, //optional, default: false. true value overrides hasPrev.
         skipForwardInterval : 15, //optional. default: 0.
         skipBackwardInterval : 15, //optional. default: 0.
         hasScrubbing : false, //optional. default to false. Enable scrubbing from control center progress bar
         
         // Android only, optional
         // text displayed in the status bar when the notification (and the ticker) are updated
         ticker      : 'Now playing "Time is Running Out"',
         //All icons default to their built-in android equivalents
         //The supplied drawable name, e.g. 'media_play', is the name of a drawable found under android/res/drawable* folders
         /*playIcon: 'media_play',
         pauseIcon: 'media_pause',
         prevIcon: 'media_prev',
         nextIcon: 'media_next',
         closeIcon: 'media_close',
         notificationIcon: 'notification'*/
         }, this.success, this.error);

        // Register callback
        MusicControls.subscribe(function(event) {
            app.onMusicEvent(event, app.media);
        });

        // Start listening for events
        // The plugin will run the events function each time an event is fired
        MusicControls.listen();
    },
    play: function() {
        this.media.play();
        setTimeout(this.initMedia, 1000);
    },
    stop: function() {
        this.media.stop();
        MusicControls.destroy();
    }

};

app.initialize();
