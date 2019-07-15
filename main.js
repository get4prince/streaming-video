// var mediaRecorder;
//
// $(document).ready(() => {
//   // console.log("dsadsa");
//   getMedia();
// });
//
// function seeStream() {
//   console.log("prince");
//   mediaRecorder.ondataavailable = e => {
//     console.log(e.data);
//   };
// }
//
// function startStream() {
//   mediaRecorder.start();
//   console.log(mediaRecorder.state);
//   console.log("recording started");
//   document.getElementById("start").style.background = "red";
//   document.getElementById("start").style.color = "black";
// }
//
// mediaRecorder.ondataavailable = function(e) {
//   // chunks.push(e.data);
//   console.log(e.data);
// };
//
// async function getMedia() {
//   var video = document.querySelector("video");
//   navigator.mediaDevices
//     .getUserMedia({
//       video: true,
//       audio: false
//     })
//     .then(stream => {
//       video.srcObject = stream;
//       console.log(stream);
//       mediaRecorder = new MediaRecorder(stream);
//       mediaRecorder.ondataavailable = e => console.log(e.data);
//     })
//     .catch(err => {
//       console.log(err);
//     });
//
//   // var recorded = recorder(stream, { interval: 1000 });
//   // socket.emit('stream' , stream );
// }



var haveLoadedMetadata = stream => {
  let preview = document.createElement("video");
  preview.srcObject = stream;
  return new Promise(resolve => preview.onloadedmetadata = resolve);
};

var start = ms => navigator.mediaDevices.getUserMedia({video: true})
  .then(stream => haveLoadedMetadata(stream)
    .then(() => record(stream, ms))
    .then(recording => {
      stop(stream);

      var file = recording[0];
      var str = ss.createStream();
      ss(socket).emit('file', str, {size: file.size });
      ss.createBlobReadSteam(file).pipe(str);

      video.src = link.href = URL.createObjectURL(new Blob(recording));
      link.download = "recording.webm";
      link.innerHTML = "Download recording";
      log("Playing "+ recording[0].type +" recording:");
    }))
  .catch(log);

var record = (stream, ms) => {
  var rec = new MediaRecorder(stream), data = [];
  rec.ondataavailable = e => {
    data.push(e.data)
    console.log("data", e.data);
  }
  rec.start();
  log(rec.state + " for "+ (ms / 1000) +" seconds...");
  var stopped = new Promise((y, n) => (rec.onstop = y, rec.onerror = e => n(e.error || e.name)));
  return Promise.all([stopped, wait(ms).then(() => rec.stop())])
    .then(() => data);
};

var stop = stream => stream.getTracks().forEach(track => track.stop());
var wait = ms => new Promise(resolve => setTimeout(resolve, ms));
var log = msg => div.innerHTML += "<br>" + msg;
