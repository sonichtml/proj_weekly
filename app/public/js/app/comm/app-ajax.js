/*
 * Copyright 2013, Tgideas.qq.com
 * Creator: Sonic
 * Date: 2013-09-29
 * Modify: 2013-09-29
 */

var appAjax = (function(){
  
  /**
   * 返回AJAX反馈信息并在屏幕打印显示
   * @param  {string} msg
   * @return {func}
   */
  function callbackMsg(msg){
    var $ajaxCallbackMsg = $("#ajaxCallbackMsg");
        $ajaxCallbackMsg.html(msg).addClass('msg-show');
    setTimeout(function(){$ajaxCallbackMsg.removeClass('msg-show')},2000)
  };



  /**
   * AJAX更新内容
   * @param  {object} e ajaxupdata object
   * @return {func}
   */
  function updateSet(o){
    if( o && o.id && o.dbCollection ){
      $.ajax({
        type: "POST",
        url: "/comm-ajaxUpdateSet",
        data : o
      }).done(function( msg ) {
        callbackMsg(msg);
      }).fail(function(jqXHR, textStatus) {
        alert( "Request failed: " + textStatus );
      });
    }
  }


  /**
   * 通过过传入英文名去获取用户的role名字
   * @param  {element} e         显示角色名的element
   * @param  {object} staffName 用户英文名
   * @return {function}           
   */
  function getRoles(e,staffName){
    if(e && staffName){
      postAjaxUrl = "/comm-ajaxGetRoles?staffName="+staffName;
      $.ajax({
        type: "POST",
        url: postAjaxUrl
      }).done(function( roles ) {
        e.html(roles);
        // console.log(roles);
      }).fail(function(jqXHR, textStatus) {
        alert( "Request failed: " + textStatus );
      });
    }
  }


  /* 供闭包外部使用的方法
  -------------------------------------*/
  return{
    callbackMsg : function(msg){ showAjaxCallbackMsg(msg) },
    updateSet : function(o){ updateSet(o) },
    getRoles : function(e,staffName){ getRoles(e,staffName) }
  }

})()


