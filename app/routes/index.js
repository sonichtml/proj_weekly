/*
 * GET home page.
 */

"use strict";
var Weekly = require('../lib/weekly').Weekly,
    Project = require('../lib/weekly').Project,
    Staff = require('../lib/weekly').Staff;

var nodeExcel = require('excel-export');
/**
 * basic example usage of `mongoose-pagination`
 * querying for `all` {} items in `MyModel`
 * paginating by second page, 10 items per page (10 results, page 2)
 **/
/*
MyModel.paginate({}, 2, 10, function(error, pageCount, paginatedResults) {
  if (error) {
    console.error(error);
  } else {
    console.log('Pages:', pageCount);
    console.log(paginatedResults);
  }
}
*/

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

/*
 * product task list 
 */
exports.task = function(req, res){
  var pageShowNum = 5,  //当前一页显示多少个
      pageCur = parseInt(req.query.page) || 1,
      status = (req.query.status) ? parseInt(req.query.status) : {'$exists': true},
      priority = (req.query.priority) ? parseInt(req.query.priority) : {'$exists': true};
      // console.log(status);
  /*
  for (var param in req.query) {
   console.log(param, req.query[param]);
  }*/

  Weekly.paginate({'status':status, 'priority':priority}, {create_date:-1}, pageCur, pageShowNum, function(error, pageCount, paginatedResults) {
    if (error) {
      console.error(error);
    } else {
      // console.log('Pages:', pageCount);

      res.locals.path = req.path;
      res.locals.originalUrl = req.originalUrl;
      res.render('task', {docs:paginatedResults, pages:pageCount, pageCur:pageCur});
    }
  });
  
  /*
  Weekly.find({}).sort({create_date: -1}).exec(function(err,docs){  //结果倒叙排列
    res.render('task', {docs:docs}); 
  });*/
  // var docss = Weekly.find().sort({"_id" : -1});
};

/*
 * webRebuild task list 
 */
exports.task_rb = function(req, res){
  var pageShowNum = 5,  //当前一页显示多少个
      pageCur = parseInt(req.query.page) || 1,
      status = (req.query.status) ? parseInt(req.query.status) : {'$exists': true},
      priority = (req.query.priority) ? parseInt(req.query.priority) : {'$exists': true};

  Weekly.paginate({'status':status, 'priority':priority}, {create_date:-1}, pageCur, pageShowNum, function(error, pageCount, paginatedResults) {
    if (error) {
      console.error(error);
    } else {

      res.locals.path = req.path;
      res.locals.originalUrl = req.originalUrl;
      res.render('task-rb', {docs:paginatedResults, pages:pageCount, pageCur:pageCur});
      res.locals.ttdd = paginatedResults;
    }
  });
};

/*
 * task create 
 */
exports.task_create = function(req, res) {
  Project.find({}).sort({name: 1}).exec(function(err,docs){  //结果倒叙排列
    if(err){
      console.error(err)
    }else{
      res.render('task-create', {pj:docs}); 
    }
  });

  // res.render('task-create');
};

/*
 * task created 
 */
exports.task_created = function(req, res){
  // console.log(req.body.outputTemp);
  var outputJSON = req.body.outputTemp,
      // eval()解析JSON格式字符串
      outputJSON = eval("("+outputJSON+")");

  console.log(typeof(outputJSON));
  console.log(outputJSON);
  
  // create方法接受 object array, 可存1条或多条记录
  Weekly.create(outputJSON, function (err) {
    if(!err) {
      res.redirect('/task');
    } else {
      res.send(404, '写入失败');
      res.redirect('/task/create');
    }
  });

  /*
  var task = new Weekly(req.body.task);
  console.log(task);
  // res.send(404, function(){console.log(task);});
  
  task.save(function(err){
    if(!err) {
      res.redirect('/task');
    } else {
      // req.session.flash = new Flash("error",err.message);
      res.send(404, '写入失败');
      res.redirect('/task/create');
    }
  });*/
};

/*
 * task detail 
 */
exports.task_detail = function(req, res) {
  var id = req.params.id;
  var error = false;
  var msg = '';
  if(!id) {
    error = "warning";
    msg = '必须指定要显示的任务ID。';
  } else {
      Weekly.findById(id, function(err, docs){
        res.render('task-detail', {docs:docs});
      });
  }
};

/*
 * task edit 
 */
exports.task_edit = function(req, res) {
  var id = req.params.id;
  var error = false;
  var msg = '';
  if(!id) {
    error = "warning";
    msg = '必须指定要编辑的任务ID。';
  } else {
      Weekly.findById(id, function(err, docs){
        res.render('task-edit', {docs:docs});
      });
  }
};

/*
 * task search 
 */
exports.task_search = function(req, res) {
  var query = req.query.q;
  console.log(query);

  if(/\d{4,}/.test(query)){
    // 按ID精确查找
    console.log("精确查找")
    Weekly.find({_id:query}, function(err, docs){
       res.render('task-search', {docs:docs});
    });
  }else if(!query){
    console.log("必须输入ID或标题");
  }else{
    // 通过title模糊查找
    Weekly.find({
      title : new RegExp(query)
    }).sort({create_date: -1}).exec(function(err,docs){  //结果倒叙排列
       res.render('task-search', {docs:docs})
    });

  }
};

exports.task_update = function(req, res) {
  var id = req.params.id;
  var task = new Weekly(req.body.task);
  // var task = req.body.task;
  console.log(task);
  Weekly.findByIdAndUpdate(id, 
    { 
      $set: { 
        title : task.title,
        type : task.type,
        priority : task.priority,
        focus : task.focus,
        content : task.content,
        pages : task.pages,
        online_date : task.online_date,
        rb_star_date : task.rb_star_date,
        rb_end_date : task.rb_end_date,
        pp : task.pp,
        pm : task.pm,
        status : task.status,
        progress : task.progress
      }
    }, 
    { upsert : true },
    function (err) {
      if (err){
        res.send(404, err.message);
      }else {
        res.redirect('/task/'+id);
      }
    }
  );

};

exports.task_del = function(req, res) {
  var id = req.params.id;
  var error = false;
  var msg = '';
  if(!id) {
    error = "warning";
    msg = '必须指定要删除的任务。';
  } else {
    Weekly.remove({_id:id},function(err){
      if (err) {
        res.send(404, err.message);
      } else {
        res.redirect('/task');
      }
    });
  }
  // req.session.flash = new Flash(error, msg);
};

/*
 * 需求列表修改AJAX保存
 */
exports.task_ajaxUpdate = function(req, res) {
  var id = req.query.id,
      fieldName = req.query.fieldName,
      fieldValue = req.query.fieldValue;
  var updateObj = {};
      updateObj[fieldName] = fieldValue;
  // console.log(updateObj);
  // var task = req.body.task;
  // console.log(id);console.log(fieldName);console.log(fieldValue);
  
  if( id && fieldName ){  
    console.log('ajax saveing');
    Weekly.findByIdAndUpdate(id, 
      updateObj, 
      {upsert : true},
      function (err) {
        if (err){
          res.send(404, "格式错误，修改失败");
        }else {
          // res.redirect('/task/'+id);
          res.send(200, "修改成功！");
          // console.log("保存成功");
        }
      }
    );
  }
};

/*
 * 日历中的需求拖动后修改保存
 */
exports.calendar_ajaxUpdate = function(req, res) {
  // console.log(req.body.start);
  var id = req.query.id,
      start = req.query.start,
      end = req.query.end;
  var updateObj = {};
      updateObj["rb_star_date"] = start;
      updateObj["rb_end_date"] = end;
  console.log(updateObj);

  if( id && start && end ){
    console.log("ajax saveing");
    Weekly.findByIdAndUpdate(id, updateObj, 
      {upsert : true},
      function (err) {
        if (err){
          res.send(404, "格式错误，修改失败");
        }else {
          res.send(200, "修改成功！");
        }
    });
  }

};

/*
 * 响应并响出索引结果json数据
 */
exports.task_callJSON = function(req, res){
  var role = req.query.role;
  var date = new Date(),
      d = date.getDate(),
      m = date.getMonth(),
      y = date.getFullYear();

  // console.log(role);
  var date = new Date(), d = date.getDate(),m = date.getMonth(),y = date.getFullYear();
  if (role == "rb"){
    //重构角色 日历表返回 重构开始时间为本月1号 - 本月30号
    Weekly.find({
      "rb_star_date": {"$gte": new Date(y, m, 1), "$lte": new Date(y, m, 30)}
    }).sort({create_date: -1}).exec(function(err,docs){  //结果倒叙排列
      res.json(docs)
    });
    
  } else if ( role == "pm" ){
    //产品角色 日历表返回 上线时间为本月1号 - 下月月30号
    Weekly.find({
      "online_date": {"$gte": new Date(y, m, 1), "$lte": new Date(y, m+1, 30)}
    }).sort({create_date: -1}).exec(function(err,docs){  //结果倒叙排列
      res.json(docs)
    });
  }
};


/*
 * export Weekly Data
 */
exports.task_export = function(req, res){
  var taskStarDate = (req.query.taskStarDate) ? req.query.taskStarDate : {'$exists': true},
      taskEndDate = (req.query.taskEndDate) ? req.query.taskEndDate : {'$exists': true};
  // console.log(taskStarDate);console.log(taskEndDate);
  Weekly.find({
    "rb_star_date": {"$gte": taskStarDate, "$lte": taskEndDate}
  }).sort({create_date: -1}).exec(function(err,docs){  //结果倒叙排列
    res.render('export', {docs:docs})
  })
};


/*
 * export Excel File
 */
exports.excel = function(req, res){
  
  var colsData = req.body.outputCols;
  var rowsData = req.body.outputRows;
  var outputDataRange = req.body.outputDataRange || "unknowDate";

  if(colsData && rowsData){
    // eval()解析JSON格式字符串
    colsData = eval("("+colsData+")");
    rowsData = eval("("+rowsData+")");
    console.log(colsData);console.log(rowsData);

    //设置excel的文件名
    var excelFileName = "username" + "_" + outputDataRange + ".xlsx";
    console.log(excelFileName);

    var conf = {};
    conf.cols = colsData;
    conf.rows = rowsData;
    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + excelFileName);
    res.end(result, 'binary');
  }

/*
    var conf ={};
    conf.cols = [
        {caption:'string', type:'string'},
        {caption:'date', type:'date'},
        {caption:'bool', type:'bool'},
        {caption:'number', type:'number'}               
    ];
    conf.rows = [
        ['pi', (new Date(2013, 4, 1)), true, 3.14],
        ["e", (new Date(2012, 4, 1)), false, 2.7182]
    ];
    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    res.end(result, 'binary');
*/
};

/*
 * Setting Project Manager
 */
exports.setting_project = function(req, res){
  var pageShowNum = 20,  //当前一页显示多少个
      pageCur = parseInt(req.query.page) || 1,
      // 大小写不敏感的正则搜索
      query = (req.query.projectName) ? { $regex: new RegExp("^" + req.query.projectName.toLowerCase(), "i") } : {'$exists': true};
  // console.log(query);
  /*
  Project.find({}, function (err, docs) {
    if (err) {console.error(err);
    } else {
      res.render('setting-project', {docs:docs}); 
    }
  });*/
     
  Project.paginate(
    {"name" : query },
    {}, pageCur, pageShowNum, function(error, pageCount, paginatedResults) {
    if (error) {
      console.error(error);
    } else {
      res.locals.path = req.path;
      res.locals.originalUrl = req.originalUrl;
      res.render('setting-project', {docs:paginatedResults, pages:pageCount, pageCur:pageCur});
    }
  });
 
};

/*
 * Setting Project Save
 */
exports.setting_project_created = function(req, res){
  var pj = new Project(req.body.project);
  console.log(pj);
  
  pj.save(function(err){
    if(!err) {
      res.redirect('/setting-project');
    } else {
      res.send(404, '写入失败');
      res.redirect('/setting-project');
    }
  });
};

/*
 * Setting Project Del
 */
exports.setting_project_del = function(req, res) {
  var id = req.params.id;
  var error = false;
  var msg = '';
  if(!id) {
    error = "warning";
    msg = '必须指定要删除的任务。';
  } else {
    Project.remove({_id:id},function(err){
      if (err) {
        res.send(404, err.message);
      } else {
        res.redirect('/setting-project');
      }
    });
  }
};

/*
 * Setting Staff Create
 */
exports.setting_staff_create = function(req, res) {
  if ( req.body.staff ){
    var staff = new Staff(req.body.staff);
    // console.log(staff);
    staff.save(function(err){
      if(!err) {
        res.redirect('/setting-staff');
      } else {
        res.send(404, '写入失败');
        res.redirect('/setting-staff/create');
      }
    });
  }else{
    Project.find({}, function (err, docs) {
      if (err) {
        console.error(err);
      } else {
        res.render('setting-staff-create', {pj:docs}); 
      }
    });
  }
};

/*
 * Setting Staff List
 */
exports.setting_staff = function(req, res) {
  var pj_array = new Array(),
      // 大小写不敏感的正则搜索
      query = (req.query.staffName) ? { $regex: new RegExp("^" + req.query.staffName.toLowerCase(), "i") } : {'$exists': true};
  console.log(query);

  Project.find({},function(err,docs){
    if(err){
      console.error(err);
    }else{
      for(var i=0; i <docs.length;i++){
        pj_array[i] = {id:docs[i]._id, name:docs[i].name}
        pj_array[docs[i]._id] = docs[i].name
      }
    }
    res.locals.pj_array = pj_array;
    /*-----*/
    Staff.find( {"name" : query }, function (err, docs) {
      if (err) {
        console.error(err);
      } else {
        res.render('setting-staff', {docs:docs});
      }
    });
    /*-----*/
  });
};



/*
 * Comm : Ajax Update Set
 */
exports.comm_ajaxUpdateSet = function(req, res) {
  var data = req.body;  
  var id = data.id,
      dbCollection = data.dbCollection;
  delete data.id;
  delete data.dbCollection;

  // console.log(id);console.log(dbCollection);console.log(data);

  if(dbCollection == "Project" ){
    dbCollection = Project;
  }else if(dbCollection == "Weekly" ){
    dbCollection = Weekly;
  }else if(dbCollection == "Staff"){
    dbCollection = Staff;
  }
  
  if( id && dbCollection && data ){  
    console.log('ajax saveing');
    dbCollection.findByIdAndUpdate(id, 
      data, 
      {upsert : true},
      function (err) {
        if (err){
          res.send(404, "格式错误，修改失败");
        }else {
          // res.redirect('/task/'+id);
          res.send(200, "修改成功！");
          // console.log("保存成功");
        }
      }
    );
  }
};


/*
 * Comm : Ajax Get Roles
 */
exports.comm_ajaxGetRoles = function(req, res) {
  var staffName = req.query.staffName,
      rolesText = ["未定义角色","产品角色", "管理角色", "重构角色"];

  console.log(staffName);
  if(staffName){
    Staff.find({name:staffName}).limit(1).exec(function(err,docs){
      if(err){
        res.send(404, "参数错误");
      }else{
        var roles = rolesText[docs[0].roles] || "获取角色失败";
        // console.log(roles);
        res.send(200, roles);
      }
    });
  }

};



