"use strict";

var dataRef = new Firebase('https://qandaproject.firebaseio.com/');

$(document).ready(init);

var $template = $("#template");
var $tableBody = $('#posts');
var commenting = false, userRef;

function init(){
  $("#addPost").click(addPost);
  $("tbody").on("click", ".title", seeDetails);
  $("#myModal").on("click", "#addComment", addComment);
}


function addPost(event){
  event.preventDefault();
  var dateTime = moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a');
  var post = {};
  post.title = $('#title').val();
  post.content= $('#postContent').val();
  post.dateTime = dateTime;
  dataRef.push(post);
  $("#newPost").trigger("reset");
}



dataRef.on('value', function(snapshot){
  var $rows = [];

  snapshot.forEach(function(childSnap){
    var post = childSnap.val();
    console.log("post", post);
    var key = childSnap.key();
    var $postRow = $template.clone();

    $postRow.removeAttr("id");
    $postRow.attr("uid", key);
    $postRow.children(".title").text(post.title);
    //$contactRow.children(".lastName").text(post.content);
    $postRow.children(".date").text(post.dateTime);
    $rows.push($postRow);
  ;
  $tableBody.empty().append($rows);
  });
});





function seeDetails(){
  event.preventDefault();
  commenting = true;

  var $row = $(this).closest("tr");
  var uid = $row.attr("uid");
  userRef = dataRef.child(uid);
  var title, content, date;

  userRef.on('value', function(snapshot){
    var $rows = [];

    snapshot.forEach(function(childSnap){
      var post = childSnap.val();
      var key = childSnap.key();
      var $postRow = $("<div>");

      $postRow.attr("uid", key);
      $postRow.text(post.date + ":  " + post.content);

      $rows.push($postRow);

      $("#comments").empty().append($rows);
    });

    title = snapshot.val().title;
    content = snapshot.val().content;
    date = snapshot.val().dateTime;

  });

  $('.modal-title').text(date + ",  " + title);
  $('#questionDetails').text(content);
  $('#myModal').modal("show");

  }



function addComment(){
  event.preventDefault();
  var comment = {};
  var dateTime = moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a');

  comment.content = $('#answer').val();
  comment.dateTime = dateTime;
  console.log(comment.content);
  userRef.push(comment);

  userRef.on('value', function(snapshot){
    var $rows = [];

  snapshot.forEach(function(childSnap){
    var post = childSnap.val();
    var key = childSnap.key();
    var $postRow = $("<div>");

    $postRow.attr("uid", key);
    $postRow.text(post.date + ":  " + post.content);

    $rows.push($postRow);

    $("#comments").empty().append($rows);
  });


  $("#answer").trigger("reset");
})
}
