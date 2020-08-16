const express = require('express');
const path = require('path');
var mysql = require('mysql'); //mysql 모듈을 로딩.
var bodyParser = require('body-parser');
var db_config = require('./db_config.json');
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));
//router.use(express.static('public'));

var connection = mysql.createConnection({
  host     : db_config.host,
  user     : db_config.user,
  password : db_config.password,
  database : db_config.database
});

router.get('/', function(req, res){
  res.redirect('/board/guest/1');
});

router.get('/list/:id', function(req, res, next) {
  var page_id = req.params.id;
  connection.query('select * from board1',function(err,results, fields){
    if(err) console.log(err);
    connection.query('select date_format(time, "%Y-%m-%d %H:%i:%s") as time from board1', function(err, result2, fields){
      if(err) console.log(err);
      res.render('list', { page_id : page_id, title:'방명록',rows: results, times: result2});
    })
  });
});

router.get('/guest/:id', function(req,res){
      var id=req.params.id;
      console.log(id);
      connection.query('select * from guest1', function(err, results, fields){
        if(err) console.log(err);
        connection.query('select date_format(time, "%H:%i %Y-%m-%d" ) as time from guest1', function(err, result2){
            if(err) console.log(err);
            res.render('list2', {page_id : id, rows : results, times : result2});
        })
      })
});

router.post('/guest_write', function(req, res){
  var post = req.body;
  var writer = post.guest_name;
  var desc = post.guest_desc;
  connection.query('insert guest1(writer, description) values(?,?)', [writer, desc], function(err){
    if(err) console.log(err);
    res.redirect('/board/guest/1');
  })
});

router.get('/read/:id',function (req,res,next) {
  var id = req.params.id;
  connection.beginTransaction(function(err){
        if(err) console.log(err);
          connection.query(`select * from board1 where id=${id}`,function(err,rows){
            if(err) console.log(err);
            var counter = rows[0].counter+1;
            connection.query(`update board1 set counter = '?' where id=${id}`, [counter], function(err, result){
              if(err) console.log(err);
              connection.query('select date_format(time, "%Y-%m-%d %H:%i:%s") as time from board1 where id=?',[id], function(err, result2){
                  if(err) console.log(err);
                  connection.query(`select * from comment1 where parent_id=${id}`,function(err,rows2){
                    if(err) console.log(err);
                    connection.commit(function (err) {
                        if(err) console.log(err);
                            connection.query('select date_format(time, "%Y-%m-%d %H:%i:%s") as time from comment1 where parent_id=?',[id], function(err, result3){
                              if(err) console.log(err);
                                connection.query('select id from board1',function (err,rows3) {
                                  if(err) console.log(err);
                                  var page_id = Math.floor((rows3.length-id)/10)+1;
                                  console.log(page_id);
                                  res.render('read',{page_id : page_id, data : rows[0], data2 : rows2, time : result2[0], times : result3});
                                })
                            })
                       })
                   })
              })
          })
      })
    })
});



router.get('/write', function(req,res){
  res.render('write', {title:'글을 작성하여라...'});
});

router.post('/write', function(req,res) {
  var post = req.body;
  var writer = post.writer;
  var title = post.title;
  var description = post.description;
  connection.beginTransaction(function(err) {
    if(err) console.log(err);
    connection.query("insert  board1(title,writer,description) values(?,?,?)",[title, writer, description]
        ,function (err) {
          if(err) {
            console.log(err);
            connection.rollback(function () {
              console.error('rollback error1');
            })
          }
          connection.query('SELECT LAST_INSERT_ID() as id',function (err,rows) {
            if(err) {
              console.log(err);
              connection.rollback(function () {
                console.error('rollback error1');
              })
            }
            else
            {
              connection.commit(function (err) {
                if(err) console.log(err);
                var id = rows[0].id;
                res.redirect('/board/read/'+id);
              })
            }
          })
    })
  })
});


router.post('/comment_process', function(req,res) {
  var post = req.body;
  var writer = post.writer;
  var parent_id = post.parent_id;
  var description = post.description;
  connection.beginTransaction(function(err) {
    if(err) console.log(err);
    connection.query("insert  comment1(writer,description,parent_id) values(?,?,?)",[writer, description,parent_id]
        ,function (err) {
          if(err) console.log(err);
          connection.query("select comment_num from board1 where id=?", [parent_id], function(err, result, fields){
              if(err) console.log(err);
              var comment_num ;
              if(result[0].comment_num==null) comment_num=0;
              else comment_num = result[0].comment_num+1;
              connection.query("update board1 set comment_num = ? where id=?", [comment_num, parent_id], function(err, result){
                if(err) console.log(err);
                res.redirect('/board/read/'+parent_id);
              })
            })
        })
    })
});

module.exports = router;
