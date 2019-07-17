import "./styles.css";

const recordContainer = document.getElementById("jsRecordContainer");
const countPreview = document.getElementById("jsCountPreview");
const recordBtn = document.getElementById("jsRecordBtn");

let streamObject;
let audioRecorder;
var totalSeconds = 0;
var timerset;

function countTimer() {
  totalSeconds++;
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  var seconds = totalSeconds - (hours * 3600 + minutes * 60);
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  countPreview.innerHTML = `${hours}:${minutes}:${seconds}`;
}

const handleVideoData = event => {
  const { data: audioFile } = event;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(audioFile);
  link.download = "recorded.webm";
  document.body.appendChild(link);
  link.click();
};

const stopRecording = () => {
  clearInterval(timerset);
  totalSeconds = 0;
  countPreview.innerHTML = "⏰Count it!";
  audioRecorder.stop();
  recordBtn.removeEventListener("click", stopRecording);
  recordBtn.addEventListener("click", getVideo);
  recordBtn.innerHTML = "🎞Start Recording";
};

const startRecording = () => {
  timerset = setInterval(countTimer, 1000);
  audioRecorder = new MediaRecorder(streamObject);
  audioRecorder.start();
  audioRecorder.addEventListener("dataavailable", handleVideoData);
  recordBtn.addEventListener("click", stopRecording);
};
const getVideo = () => {
  navigator.mediaDevices
    .getUserMedia({
      audio: { type: "audio/webm;codecs=opus" }
    })
    .then(stream => {
      countPreview.muted = true;
      recordBtn.innerHTML = "👋🏻Stop Recording";
      streamObject = stream;
      startRecording();
      recordBtn.removeEventListener("click", getVideo);
    });
};

function init() {
  recordBtn.addEventListener("click", getVideo);
}

if (recordContainer) {
  init();
}
