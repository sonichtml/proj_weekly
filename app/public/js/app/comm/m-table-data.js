/*
 * Copyright 2013, Tgideas.qq.com
 * Creator: Sonic
 * Date: 2013-08-06
 * Modify: 2013-08-06
 */


(function(){
  /* commInitDomReady
  ----------------------------------------------------------------------------------*/
  function commInitDomReady(){
    /* .m-table-data 通用事件
    -----------------------------------------*/
    //- tr hover 变色  ----
    if($("table.m-table-data")){
      $( "table.m-table-data" ).delegate( "tr", "hover", function() {
        $( this ).toggleClass( "table-hover" );
      });
    }

    //- select.editinput 选择事件 ----
    $("table.m-table-data").delegate("select.editinput","change",function(){
      //- 让它所在的td执行一次双击事件
      var _self = $(this);
      _self.parent().find("input[type='hidden']").val(_self.val());
      _self.parent().trigger('dblclick');
    })

    //- select.editinput 回车事件 ----
    $("table.m-table-data").delegate("input.editinput","keydown",function(e){
      var key = e.which;
      if (key == 13) {
        $(this).parent().trigger('dblclick');
      }
    })

     //- input.date-picker 日期重选后自动保存事件 ----
    $("table.m-table-data").delegate("input.date-picker","change",function(e){
        $(this).parent().trigger('dblclick');
    })
  }

  $(commInitDomReady);
})()

