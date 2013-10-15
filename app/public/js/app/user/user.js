// User all func
(function(){
  //- 初始化 ------------------------------------------------------------------
  function initDomReady(){
    // 获取用户的角色名
    var $userRolse = $("#userRoles"),
        staffName = $("#userRtx").html();
    if( $userRolse && staffName ){
      appAjax.getRoles($userRolse,staffName);
    }




  }
  
  $(initDomReady);
})()