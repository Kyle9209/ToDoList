function setListData(uid) {
  // 로딩 시작
  showLoading();

  // 파라미터로 받은 날짜가 있는지 확인 후 진행
  var date = document.getElementById('selectDate');
  var param = getParam('date');
  if (param == null || param == "") {
    // 없으면 오늘날짜 획득 및 셋팅
    date.value = getToday();
  } else {
    // 받은 파라미터 셋팅
    date.value = param;
  }

  // firebase 데이터 구조
  // Ref
  //  ┠ 2020-05-25
  //  .    ├ RandomKey ┬ title
  //  ..   .           ├ content
  //  ...  ..          └ time
  //  .... ...
  var query = firebase.database().ref("list").child(uid).child(date.value).orderByKey();
  query.once('value')
    .then(function(snapshot){
      // 데이터 받으면 로딩 종료
      removeLoading();

      // 기존 데이터 초기화
      $('#accordion').empty();
      removeNoData();

      // 데이터가 없으면 noData 보이기
      if (snapshot.exists()) {
        removeNoData();
      } else {
        showNoData();
      }

      // 데이터 갯수만큼 루프
      snapshot.forEach(function(childSnapshot){
        var accordionPanel = "";

        accordionPanel += "<div class='panel panel-default'>";
        accordionPanel += "  <input type='text' class='key' value='" + childSnapshot.key + "'/>";
        accordionPanel += "  <div class='panel-heading'>";
        accordionPanel += "    <div class='chkbox'>";
        accordionPanel += "      <input type='checkbox' name='chkbox' id='" + childSnapshot.key + "_chkbox' " + childSnapshot.child('state').val() + "/>";
        accordionPanel += "      <label for='" + childSnapshot.key + "_chkbox'></label>";
        accordionPanel += "    </div>";
        accordionPanel += "    <h4 class='panel-title'>";
        accordionPanel += "      <a data-toggle='collapse' data-parent='#accordion' href='#" + childSnapshot.key + "_acdn'";
        if (childSnapshot.child('state').val() == "checked") {
          accordionPanel += "style='text-decoration:line-through; background: #D9E5FF;'";
        }
        accordionPanel +=          ">" + childSnapshot.child('title').val();
        accordionPanel += "        <i class='more-less glyphicon glyphicon-chevron-down'></i>";
        accordionPanel += "      </a>";
        accordionPanel += "    </h4>";
        accordionPanel += "  </div>";
        accordionPanel += "  <div class='panel-collapse collapse' id='" + childSnapshot.key + "_acdn'>";
        accordionPanel += "    <div class='panel-body'>";
        accordionPanel += "      <p id='contTxt'>" + childSnapshot.child('content').val() + "</p>";
        accordionPanel += "      <div class='panel-body-footer'>";
        accordionPanel += "        <button type='button' class='btn btn-primary btn-xs' id='modify' name='modify'>수정</button>";
        accordionPanel += "        <button type='button' class='btn btn-danger btn-xs' id='delete' name='delete'>삭제</button>";
        accordionPanel += "        <span class='time'>" + childSnapshot.child('time').val() + "</span>";
        accordionPanel += "      </div>";
        accordionPanel += "    </div>";
        accordionPanel += "  </div>";
        accordionPanel += "</div>";

        $('#accordion').append(accordionPanel);
      });
  });

  // 체크박스 이벤트 리스너 구현
  $(document).on('change', 'input[name=chkbox]', function(){
    var checkState = $(this).is(":checked");
    var panelRoot = $(this).parent().parent().parent();
    var state = "";

    if (checkState) {
      panelRoot.find("a").css("text-decoration", "line-through");
      panelRoot.find("a").css("background", "#D9E5FF");
      state = "checked";
    } else {
      panelRoot.find("a").css("text-decoration", "none");
      panelRoot.find("a").css("background", "#f8f8f8");
      state = "unchecked";
    }

    // 체크 변경 시 서버의 값도 같이 바꿔줌
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var key = panelRoot.find(".key").val();
        var query = firebase.database().ref("list").child(user.uid).child(date.value).child(key);
        query.update({
          "state": state
        });
      } else {
        // User is signed out -> 로그인화면으로
        location.href = "login.html";
        return;
      }
    });
  });

  // 삭제 버튼 이벤트 리스너 구현
  $(document).on('click', 'button[name=delete]', function(){
    var panelRoot = $(this).parent().parent().parent().parent();
    var key = panelRoot.find(".key").val();

    var rtnConfirm = confirm('해당 메모를 삭제하시겠습니까?');

    if (rtnConfirm) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          var query = firebase.database().ref("list").child(user.uid).child(date.value).child(key);
          query.remove()
            .then(function() {
              // 정상적으로 삭제되면 화면 새로고침
              window.location.reload();

            }).catch(function(error) {
              console.log("Remove failed: " + error.message);
            });
        } else {
          // User is signed out -> 로그인화면으로
          location.href = "login.html";
          return;
        }
      });
    }
  });

  // 수정 버튼 이벤트 리스너 구현
  $(document).on('click', 'button[name=modify]', function(){
    var panelRoot = $(this).parent().parent().parent().parent();
    var key = panelRoot.find(".key").val();

    // 수정화면으로 이동 및 데이터 전달
    location.href= "mod.html?date=" + date.value + "&key=" + key;
  });
}

// 아코디언 화살표 이미지 변경 함수
function toggleIcon(e) {
  $(e.target)
    .prev(".panel-heading")
    .find(".more-less")
    .toggleClass("glyphicon-chevron-up glyphicon-chevron-down");
}
$(".panel-group").on("hidden.bs.collapse", toggleIcon);
$(".panel-group").on("shown.bs.collapse", toggleIcon);
