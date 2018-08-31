  const innerAudioContext = wx.createInnerAudioContext()
  const playAudio = data => {
    innerAudioContext.src = 'http://music.163.com/song/media/outer/url?id=412902950.mp3'
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  }


  // const playAudio = {
  //   play(){
  //     innerAudioContext.play();
  //   },
  //   pause(){
  //     innerAudioContext.play();
  //   }
  // }

  // module.exports = {
  //   playAudio: playAudio
  // }