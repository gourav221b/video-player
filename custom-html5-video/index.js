const video = document.getElementById("video");
const videoControls = document.getElementById("video-controls");
const playButton = document.getElementById("play");
const playScreenBtn= document.getElementById("playpauseIcon");
const playbackIcons = document.querySelectorAll(".playback-icons use");
const timeElapsed = document.getElementById("time-elapsed");
const duration = document.getElementById("duration");
const progressBar = document.getElementById("progress-bar");
const seek = document.getElementById("seek");
const seekTooltip = document.getElementById("seek-tooltip");
const volumeButton = document.getElementById("volume-button");
const volumeIcons = document.querySelectorAll(".volume-button use");
const volumeMute = document.querySelector('use[href="#volume-mute"]');
const volumeLow = document.querySelector('use[href="#volume-low"]');
const volumeHigh = document.querySelector('use[href="#volume-high"]');
const volume = document.getElementById("volume");
const playbackAnimation = document.getElementById("playback-animation");
const fullscreenButton = document.getElementById("fullscreen-button");
const videoContainer = document.getElementById("video-container2");
const theaterMode= document.getElementById('theaterMode')

const fullscreenIcons = fullscreenButton.querySelectorAll("use");
const pipButton = document.getElementById("pip-button");
const forwardAnimation = document.getElementById("forward-animation");
const backwordAnimation = document.getElementById("backword-animation");
const volumUp = document.getElementById("volume-forward");
const volumDown = document.getElementById("volume-dn");
const backwardBtn= document.getElementById('backward')
const forwardBtn= document.getElementById('forward')
const airPlay = document.getElementById("air-play");
const settingIcon= document.getElementById('settingIcon')
const settingsDiv= document.getElementById('playbacksettings')
const audiosettingsDiv= document.getElementById('audiosettings')
const videoWorks = !!document.createElement("video").canPlayType;
if (videoWorks) {
  video.controls = false;
  videoControls.classList.remove("hidden");
}
// Add functions here

// togglePlay toggles the playback state of the video.
// If the video playback is paused or ended, the video is played
// otherwise, the video is paused
// document.getElementById('playpauseIcon').addEventListener('click',()=>{togglePlay})
function togglePlay() {
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
  }

}

// updatePlayButton updates the playback icon and tooltip
// depending on the playback state
function updatePlayButton() {
  playbackIcons.forEach((icon) => icon.classList.toggle("hidden"));

  if (video.paused) {
    playButton.setAttribute("data-title", "Play (k)");
    document.querySelector('#playpauseIcon>img').src="play.png"
  } else {
    playButton.setAttribute("data-title", "Pause (k)");
    document.querySelector('#playpauseIcon>img').src="pause.png"
  }
}

// formatTime takes a time length in seconds and returns the time in
// minutes and seconds
function formatTime(timeInSeconds) {
  const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

  return {
    minutes: result.substr(3, 2),
    seconds: result.substr(6, 2),
  };
}

// initializeVideo sets the video duration, and maximum value of the
// progressBar
function initializeVideo() {
  const videoDuration = Math.round(video.duration);
  seek.setAttribute("max", videoDuration);
  progressBar.setAttribute("max", videoDuration);
  const time = formatTime(videoDuration);
  duration.innerText = `${time.minutes}:${time.seconds}`;
  duration.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
}

// updateTimeElapsed indicates how far through the video
// the current playback is by updating the timeElapsed element
function updateTimeElapsed() {
  const time = formatTime(Math.round(video.currentTime));
  timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
  timeElapsed.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
}

// updateProgress indicates how far through the video
// the current playback is by updating the progress bar
function updateProgress() {
  seek.value = Math.floor(video.currentTime);
  progressBar.value = Math.floor(video.currentTime);
}

// updateSeekTooltip uses the position of the mouse on the progress bar to
// roughly work out what point in the video the user will skip to if
// the progress bar is clicked at that point
function updateSeekTooltip(event) {
  const skipTo = Math.round(
    (event.offsetX / event.target.clientWidth) *
      parseInt(event.target.getAttribute("max"), 10)
  );
  seek.setAttribute("data-seek", skipTo);
  const t = formatTime(skipTo);
  seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
  const rect = video.getBoundingClientRect();
  seekTooltip.style.left = `${event.pageX - rect.left}px`;
}

// skipAhead jumps to a different point in the video when the progress bar
// is clicked

// document.querySelector('#forward').onclick=skipAhead(10)
// document.querySelector('#backward').onclick=skipBack(10)
function skipAhead(event) {  
  const skipTo = event.target.dataset.seek
    ? event.target.dataset.seek
    : event.target.value;
  video.currentTime = skipTo;
  progressBar.value = skipTo;
  seek.value = skipTo;
}
function skipBack(event) {  
  const skipTo = event.target.dataset.seek-value
    ? event.target.dataset.seek
    : event.target.value;
  video.currentTime = skipTo;
  progressBar.value = skipTo;
  seek.value = skipTo;
}

// updateVolume updates the video's volume
// and disables the muted state if active
function updateVolume() {
  if (video.muted) {
    video.muted = false;
  }
  video.volume = volume.value;
}

function increaseVolume() {
  if (video.muted) {
    video.muted = false;
  } else {
    volume.value += 0.2;
  }
}

function decreaseVolume() {
  volume.value = volume.dataset.volume;
  if (volume.value === 0) {
    video.muted;
    console.log(video.muted);
    toggleMute();
  } else {
    volume.value -= 0.2;
  }
}

// updateVolumeIcon updates the volume icon so that it correctly reflects
// the volume of the video
function updateVolumeIcon() {
  volumeIcons.forEach((icon) => {
    icon.classList.add("hidden");
  });

  volumeButton.setAttribute("data-title", "Mute (m)");

  if (video.muted || video.volume === 0) {
    volumeMute.classList.remove("hidden");
    volumeButton.setAttribute("data-title", "Unmute (m)");
  } else if (video.volume > 0 && video.volume <= 0.5) {
    volumeLow.classList.remove("hidden");
  } else {
    volumeHigh.classList.remove("hidden");
  }
}

// toggleMute mutes or unmutes the video when executed
// When the video is unmuted, the volume is returned to the value
// it was set to before the video was muted
function toggleMute() {
  video.muted = !video.muted;

  if (video.muted) {
    volume.setAttribute("data-volume", volume.value);
    volume.value = 0;
  } else {
    volume.value = volume.dataset.volume;
  }
}

// animatePlayback displays an animation when
// the video is played or paused
function animatePlayback() {
  playbackAnimation.animate(
    [
      {
        opacity: 1,
        transform: "scale(1)",
      },
      {
        opacity: 0,
        transform: "scale(1.3)",
      },
    ],
    {
      duration: 500,
    }
  );
}

function animateForwardButton() {
  forwardAnimation.animate(
    [
      {
        opacity: 1,
        transform: "scale(1)",
      },
      {
        opacity: 0,
        transform: "scale(1.3)",
      },
    ],
    {
      duration: 500,
    }
  );
}

function animateBackwordButton() {
  backwordAnimation.animate(
    [
      {
        opacity: 1,
        transform: "scale(1)",
      },
      {
        opacity: 0,
        transform: "scale(1.3)",
      },
    ],
    {
      duration: 500,
    }
  );
}

function animateVolumeUp() {
  volumUp.animate(
    [
      {
        opacity: 1,
        transform: "scale(1)",
      },
      {
        opacity: 0,
        transform: "scale(1.3)",
      },
    ],
    {
      duration: 500,
    }
  );
}

function animateVolumeDown() {
  volumDown.animate(
    [
      {
        opacity: 1,
        transform: "scale(1)",
      },
      {
        opacity: 0,
        transform: "scale(1.3)",
      },
    ],
    {
      duration: 500,
    }
  );
}

function skip(time){
  video.currentTime=video.currentTime+time;
}
function forward(){
  skip(15);
}

function backward(){
   skip(-15);
}


// toggleFullScreen toggles the full screen state of the video
// If the browser is currently in fullscreen mode,
// then it should exit and vice versa.
function toggleFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else if (document.webkitFullscreenElement) {
    // Need this to support Safari
    document.webkitExitFullscreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    // Need this to support Safari
    videoContainer.webkitRequestFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
}

// updateFullscreenButton changes the icon of the full screen button
// and tooltip to reflect the current full screen state of the video
function updateFullscreenButton() {
  fullscreenIcons.forEach((icon) => icon.classList.toggle("hidden"));

  if (document.fullscreenElement) {
    fullscreenButton.setAttribute("data-title", "Exit full screen (f)");
  } else {
    fullscreenButton.setAttribute("data-title", "Full screen (f)");
  }
}

// togglePip toggles Picture-in-Picture mode on the video
async function togglePip() {
  try {
    if (video !== document.pictureInPictureElement) {
      pipButton.disabled = true;
      await video.requestPictureInPicture();
    } else {
      await document.exitPictureInPicture();
    }
  } catch (error) {
    console.error(error);
  } finally {
    pipButton.disabled = false;
  }
}

// hideControls hides the video controls when not in use
// if the video is paused, the controls must remain visible
function hideControls() {
  if (video.paused) {
    return;
  }

  videoControls.classList.add("hide");
}

// showControls displays the video controls
function showControls() {
  videoControls.classList.remove("hide");
}

function toggleairPlay() {
  console.log("AirPlay");
  if (window.WebKitPlaybackTargetAvailabilityEvent) {
    video.addEventListener(
      "webkitplaybacktargetavailabilitychanged",
      function (event) {
        switch (event.availability) {
          case "available":
            airPlay.hidden = false;
            airPlay.disabled = false;
            console.log("available");
            break;
          case "not-available":
            airPlay.hidden = true;
            airPlay.disabled = true;
            console.log("Not- Available");

            break;
        }
      }
    );
  }
  if (!window.WebKitPlaybackTargetAvailabilityEvent) return;
  var airPlayButton = document.getElementById("airPlayButton");
  var video = document.getElementById("video");
  airPlayButton.addEventListener("click", function (event) {
    video.webkitShowPlaybackTargetPicker();
  });

  if (!window.WebKitPlaybackTargetAvailabilityEvent) return;
  var video = document.getElementById("video");
  video.addEventListener(
    "webkitcurrentplaybacktargetiswirelesschanged",
    function (event) {
      updateAirPlayButtonWirelessStyle();
      updatePageDimmerForWirelessPlayback();
    }
  );
  // if (window.WebKitPlaybackTargetAvailabilityEvent) {
  //   video.addEventListener(
  //     "webkitplaybacktargetavailabilitychanged",
  //     function (event) {
  //       switch (event.availability) {
  //         case "available":
  //           airPlay.style.display = "block";
  //           break;

  //         default:
  //           airPlay.style.display = "none";
  //       }

  //       airPlay.addEventListener("click", function () {
  //         video.webkitShowPlaybackTargetPicker();
  //       });
  //     }
  //   );
  // } else {
  //   airPlay.style.display = "none";
  // }
}

// keyboardShortcuts executes the relevant functions for
// each supported shortcut key
function keyboardShortcuts(event) {
  const { key } = event;
  switch (key) {
    case "k":
      togglePlay();
      animatePlayback();
      if (video.paused) {
        showControls();
      } else {
        setTimeout(() => {
          hideControls();
        }, 2000);
      }
      break;
    case " ":
      togglePlay();
      animatePlayback();
      if (video.paused) {
        showControls();
      } else {
        setTimeout(() => {
          hideControls();
        }, 2000);
      }
      break;
    case "m":
      toggleMute();
      break;
    case "f":
      toggleFullScreen();
      break;
    case "p":
      togglePip();
      break;
    case "ArrowRight":
      console.log("btn");
      animateForwardButton();
      video.currentTime = video.currentTime + 5;
      break;
    case "ArrowLeft":
      animateBackwordButton();
      video.currentTime = video.currentTime - 5;
      break;
    case "ArrowUp":
      console.log("Up");
      // updateVolume();
      animateVolumeUp();
      increaseVolume();
      volume.value + 1;
      break;
    case "ArrowDown":
      // updateVolume();
      animateVolumeDown();
      decreaseVolume();
      volume.value - 1;
      break;
  }
}

// Add eventlisteners here
playButton.addEventListener("click", togglePlay);
playScreenBtn.addEventListener("click",togglePlay)
video.addEventListener("play", updatePlayButton);
video.addEventListener("pause", updatePlayButton);
video.addEventListener("loadedmetadata", initializeVideo);
video.addEventListener("timeupdate", updateTimeElapsed);
video.addEventListener("timeupdate", updateProgress);
video.addEventListener("volumechange", updateVolumeIcon);
video.addEventListener("click", togglePlay);
video.addEventListener("click", animatePlayback);
video.addEventListener("input", animateForwardButton);
video.addEventListener("input", animateBackwordButton);

video.addEventListener("input", animateVolumeUp);
video.addEventListener("input", animateVolumeDown);

video.addEventListener("mouseenter", showControls);
video.addEventListener("mouseleave", hideControls);
videoControls.addEventListener("mouseenter", showControls);
videoControls.addEventListener("mouseleave", hideControls);
seek.addEventListener("mousemove", updateSeekTooltip);
seek.addEventListener("input", skipAhead);
volume.addEventListener("input", updateVolume);
volumeButton.addEventListener("click", toggleMute);
fullscreenButton.addEventListener("click", toggleFullScreen);
videoContainer.addEventListener("fullscreenchange", updateFullscreenButton);
pipButton.addEventListener("click", togglePip);
airPlay.addEventListener("click", toggleairPlay);
forwardBtn.addEventListener("click",forward)
backwardBtn.addEventListener("click",backward)
settingIcon.addEventListener("click",()=>{
settingsDiv.classList.toggle('active')
settingIcon.classList.toggle('active')
})
theaterMode.addEventListener('click', ()=>
{
  videoContainer.classList.toggle('theaterMode')
})

document.addEventListener("DOMContentLoaded", () => {
  if (!("pictureInPictureEnabled" in document)) {
    pipButton.classList.add("hidden");
  }
});
document.addEventListener("keyup", keyboardShortcuts);

// video.addEventListener("input", togglePlay);
