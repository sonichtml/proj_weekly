// Setting all func
(function(){

  //- 初始化 ------------------------------------------------------------------
  function initDomReady(){
    //- current nav 
    $(".nav-ul li").eq(3).addClass("current");

    // submint func
    $("#addProjectForm").submit(function(){
        var addProjectName = $("#addProjectName").val();
        console.log(addProjectName);
        if(addProjectName !=""){
          return true;
        }else{
          alert("项目名不能为空");
          return false;
        }
    })

    //- Click to Edit ------------------------
    $("table.project-manage-table td,table.staff-manage-table td").not("td.readonly").on("dblclick",function(){
      // alert("hello");
      var _self = $(this),
          editShow = _self.find(".editable"),
          editInput = _self.find(".editinput"),
          dbCollection = _self.parents("table").attr("data-collection");
       // console.log(dbCollection);

      if(_self.hasClass('td-editing')){ //- 打开编辑时
        if(editShow.attr("data-name") =="roles" ){ return false }
        var returnHtml = editInput.val();
        editShow.html(returnHtml).show();
        editInput.remove();
        _self.removeClass("td-editing");
        // 调用 ajax-update.js 的update方法;
        
        // 拼装准备ajax发送的数据
        var recordId = _self.parent("tr").find("span[data-name='_id']").html(),
            fieldName = _self.find(".editable").attr("data-name"),
            fieldValue = _self.find(".editable").html();
        var postData = {};
            postData.id = recordId,
            postData.dbCollection = dbCollection,
            postData[fieldName] = fieldValue;
        // 数据送ajax保存
        appAjax.updateSet(postData);
      }else{                            //- 未编辑时
        var editShowHtml = editShow.html();
        if(editShow.attr("data-name") =="roles" ){
          var staffRoleSelectBox = $("#staffRoleSelectBox").html();
          var editInputHtml = '<div class="select-div editinput">'+staffRoleSelectBox+'</div>';
        }else{
          var editInputHtml = '<input type="txt" class="m-input editinput" value="'+ editShowHtml +'" />';
        }

        editShow.hide();
        _self.prepend(editInputHtml);
        _self.addClass("td-editing");
        _self.find(".editinput").focus();
      }
    })

    //- Role Select Func
    $("div.system-settings-box").delegate("select.main-select","change",function(){
    // $("#staffRoles").bind("change",function(){
      var n = parseInt($(this).val()),
          $selectDiv = $(this).parents(".select-div");
      $("select.sub-select").hide();
      if ( n==1 ){
        $selectDiv.find('select.sub-select-project').show();
        $selectDiv.find('select.sub-select-group').val(0);
      }else{
        $selectDiv.find('select.sub-select-group').show();
        $selectDiv.find('select.sub-select-project').val(0);
      }
    })

    //- .staff-role-change-button Func
    $("div.system-settings-box").delegate(".staff-role-change-button","click",function(){
      var $staffRolesTd = $(this).parents(".staffRoles");
      var postData = {};
          postData.id = $staffRolesTd.parent("tr").find("span[data-name='_id']").html(),
          postData.dbCollection = $staffRolesTd.parents("table").attr("data-collection");

      $staffRolesTd.find("select").each(function(index){
        var selectVal = $(this).val(),
            selectName = $(this).attr("name");
        $staffRolesTd.find("input[data-name="+selectName+"]").val(selectVal);
        postData[selectName] = selectVal;
      })
      console.log(postData);
      // 判断是否有选漏
      if (postData.roles == 0){
        alert("请选择角色")
      } else if( postData.roles == 1 & postData.project == 0 ){
        alert("请选择所负责的项目")
      } else if( postData.roles == 2 & postData.group == 0 ){
        alert("请选择组别")
      } else if( postData.roles == 3 & postData.group == 0 ){
        alert("请选择组别")
      }else{
        appAjax.updateSet(postData);
        tdRolesShow($staffRolesTd);
      }
    })
  }

  // 角色重新显示；
  function tdRolesShow(obj){
    var o = obj;
    var rolesText = ["未定义","产品", "管理", "重构"],
        groupText = ["未定义","重构1组", "重构2组", "重构3组"],
        rolesVal = o.find('input[data-name="roles"]').val(),
        ProjectVal = o.find('input[data-name="project"]').val(),
        groupVal = o.find('input[data-name="group"]').val();
    
    o.find('span[data-name="roles"]').html(rolesText[rolesVal]).show();
    o.find('span[data-name="line"]').show();
    if(rolesVal == 1){
      o.find('span[data-name="project"]').html(ProjectVal).show();
    }else{
      o.find('span[data-name="group"]').html(groupText[groupVal]).show();
    }

    o.find(".select-div").remove();
    o.removeClass("td-editing");
  }

  $(initDomReady);
})()