var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// 需求主表集合
var WeeklySchema = new Schema({
	author: {type: String, requierd: false},		//需求创建者
	type: {type: String, requierd: true},			//所属项目
	priority: {type:Number, defaults: 0},			//优先级
	create_date: {type:Date},						//需求创建时间
	title: {type: String, requierd: true},			//需求标题
	focus: {type:Boolean, defaults: false},			//是否重点需求
	content: {type: String, requierd: false},		//需求内容
	attachment: {type: String, requierd: false},	//需求附件
	pages: {type: String, defaults: 1},				//页面数
	online_date: {type:Date},						//上线时间
	rb_star_date: {type:Date},						//重构开始时间
	rb_end_date: {type:Date},						//重构完成时间
	pp: {type: String, requierd: true},				//需求负责人员
	pm: {type: String, requierd: false},			//需求接口人
	status: {type: Number, defaults: 0},			//需求当前状态
	progress: {type: String, requierd: false}		//需求总进度
});

// 项目表集合
var ProjectSchema = new Schema({
	name: {type: String, requierd: true},			//所属项目名
	star: {type: Number, defaults: 1}				//项目星级
});

// 人员表集合
var StaffSchema = new Schema({
	name: {type: String, requierd: true},			//英文名
	roles: {type:Number, defaults: 0},				//角色
	project: {type:String},							//项目id
	group: {type:Number, defaults: 0},				//组别
	remark: {type: String, requierd: false},		//备注信息
	create_date: {type:Date, requierd: true}		//创建时间
});

var opened = false;

mongoose.connection.on('open', function(ref) {
	opened = true;
});

mongoose.connection.on('error', function(err) {
	opened = false;
});

exports.Weekly = mongoose.model('Weekly', WeeklySchema);
exports.Project = mongoose.model('Project', ProjectSchema);
exports.Staff = mongoose.model('Staff', StaffSchema);

exports.connect = function(mongourl, options) {
	if ('undefined' === typeof options) {
		options = {
			server: {
				socketOptions: {
					keepAlive: 1
				}
			}
		};
	}
	mongoose.connect(mongourl, options);
};

exports.close = function() {
	mongoose.disconnect();
	opened = false;
};

exports.isOpen = function() {
	return opened;
};



/**
 * @method paginate
 * @param {Object} query Mongoose Query Object
 * @param {Number} pageNumber 
 * @param {Number} resultsPerPage
 * Extend Mongoose Models to paginate queries
 * https://github.com/edwardhotchkiss/mongoose-paginate
 **/
mongoose.Model.paginate = function(q, s, pageNumber, resultsPerPage, callback) { 
  var model = this;
  callback = callback || function(){};
  var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
  var query = model.find(q).skip(skipFrom).limit(resultsPerPage);
  if(s){
  	query = query.sort(s);
  }
  query.exec(function(error, results) {
    if (error) {
      callback(error, null, null);
    } else {
      model.count(q, function(error, count) {
        if (error) {
          callback(error, null, null);
        } else {
          var pageCount = Math.ceil(count / resultsPerPage);
          if (pageCount == 0) {
            pageCount = 1;
          };
          callback(null, pageCount, results);
        };
      });
    };
  });
};
exports.paginate = mongoose.model.paginate;