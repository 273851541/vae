let baseUrl = 'http://122.51.124.142:3000'
let url = {
  songDetail: baseUrl + '/song/detail',
  songUrl:'https://music.163.com/song/media/outer/url',
  lyric: baseUrl +'/lyric',
  musicList: baseUrl +'/playlist/detail',
  albumList: baseUrl +'/artist/album',
  album: baseUrl +'/album',
  searchVideo: baseUrl +'/search',
  searchMV: baseUrl +'/artist/mv',
  mvUrl: baseUrl +'/mv/url',
  videoUrl: baseUrl +'/video/url',
  search: baseUrl +'/search',
  relatedVideo: baseUrl +'/related/allvideo',
  traceList:'https://xusong.taihe.com/api/NEWS/getCalendarList.json',
  traceContentList:'https://xusong.taihe.com/api/NEWS/getActivityDetail.json'
}

export default url