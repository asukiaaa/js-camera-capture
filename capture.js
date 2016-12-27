'use strict'
$(function() {
  const videoFrame = document.querySelector("video.camera-movie")
  const photoFrame = document.querySelector("canvas.captured-image")
  const videoOptionsSelector = "select.video-devices"
  const captureButtonSelector = "a.capture-button"
  const saveButtonSelector = "a.save-button"
  const width = 640
  let height

  const setVideoFrame = () => {
    const selectedDeviceId = $(videoOptionsSelector).find("option:selected").val()

    if (!selectedDeviceId) { return }

    const constraints = {
      audio: false,
      video: {
        width,
        deviceId: { exact: selectedDeviceId }
      }
    }

    console.log(constraints)
    navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
      console.log(mediaStream)
      videoFrame.srcObject = mediaStream
      videoFrame.play()
    })
  }

  videoFrame.addEventListener('canplay', (ev) => {
    height = videoFrame.videoHeight / (videoFrame.videoWidth/width)

    if (isNaN(height)) {
      height = width * 3 / 4
    }
  })

  navigator.mediaDevices.enumerateDevices().then(devices => {
    devices.forEach(device => {
      if (device.kind == "videoinput") {
        $("select.video-devices")
          .append("<option value =\"" + device.deviceId + "\">" +
                  device.deviceId +
                  "</option>")
      }
    })
    setVideoFrame()
  })

  $(videoOptionsSelector).on('change', () => {
    setVideoFrame()
  })

  $(captureButtonSelector).on('click', (e) => {
    e.preventDefault()
    const photoContext = photoFrame.getContext('2d')
    photoFrame.width = width
    photoFrame.height = height
    photoContext.drawImage(videoFrame, 0, 0, width, height)

    let image = photoFrame.toDataURL('image/png')
    image = image.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');
    $(saveButtonSelector).attr('href', image)
  })

})
