/*
    공통함수 정의
    getToday()
    getParam(sname)
    showMask()
    showLoading()
    removeLoading()
    showNoData()
    removeNoData()
*/
// 오늘날짜를 yyyy-mm-dd 포맷으로 획득하는 함수
function getToday() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  return (yyyy + "-" + mm + "-" + dd);
}

// 주소에 있는 파라미터 획득하는 함수
function getParam(sname) {
  var params = location.search.substr(location.search.indexOf("?") + 1);
  var sval = "";
  params = params.split("&");

  for (var i = 0; i < params.length; i++) {
      temp = params[i].split("=");
      if ([temp[0]] == sname) { sval = temp[1]; }
  }

  return sval;
}

// 마스크 셋팅하는 함수
function showMask() {
  //화면의 높이와 너비 구함
  var maskHeight = $(document).height();
  var maskWidth  = window.document.body.clientWidth;

  //화면에 출력할 마스크를 설정
  var mask = "<div id='mask' style='position:absolute; z-index:9000; background-color:#000000; display:none; left:0; top:0;'></div>";

  //화면에 레이어 추가
  $('body')
      .append(mask)

  //마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채움
  $('#mask').css({
          'width' : maskWidth,
          'height': maskHeight,
          'opacity' :'0.3'
  });

  //마스크 표시
  $('#mask').show();
}

// 마스크 삭제하는 함수
function removeMask() {
  $('#mask').remove();
}

// 로딩이미지 셋팅하는 함수
function showLoading() {
  var loadingImg ='';

  loadingImg +="<div id='loadingImg'>";
  loadingImg +=" <img src='src/LoadingBlock.gif' style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)'/>";
  loadingImg +="</div>";

  $('.mainSection').append(loadingImg);
}

// 로딩이미지 삭제하는 함수
function removeLoading() {
  $('#loadingImg').remove();
}

// 파이어베이스 로그아웃 프로세스
function logoutProc() {

  var rtnConfirm = confirm('로그아웃 하시겠습니까?');

  if (rtnConfirm) {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      location.href = "login.html";

    }).catch(function(error) {
      // An error happened.
      alert(error);
    });
  }
}

// 데이터가 없을 시 nodata 문구 보이기
function showNoData() {
  var noDataStr ='';

  noDataStr +="<div id='noData'>";
  noDataStr +=" <h4><span style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)'>조회된 데이터가 없습니다.</span></h4>";
  noDataStr +="</div>";

  $('.mainSection').append(noDataStr);
}

// 데이터가 있을 시 nodata 문구 없애기
function removeNoData() {
  $('#noData').remove();
}
