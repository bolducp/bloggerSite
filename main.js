"use strict";

var dataRef = new Firebase('https://qandaproject.firebaseio.com/');

$(document).ready(init);

var $template = $("#template");
var $tableBody = $('#posts');
var postRef, globalUID;

function init(){
  $("#addPost").click(addPost);
  $("tbody").on("click", ".title", seeDetails);
  $("#myModal").on("click", "#addComment", addComment);
  $("#myModal").on("hide.bs.modal", answerModalClosed);
}

dataRef.on('value', function(snapshot){
  var rows = [];
  snapshot.forEach(function(childSnap){
    var post = childSnap.val();
    var key = childSnap.key();
    var $postRow = $template.clone();
    $postRow.removeAttr("id");
    $postRow.attr("uid", key);
    $postRow.children(".title").text(post.title);
    $postRow.children(".date").text(post.dateTime);
    rows.push($postRow);
    $tableBody.empty().append(rows);
  });
});

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

function seeDetails(){
  event.preventDefault();
  var row = $(this).closest("tr");
  var uid = row.attr("uid");
  globalUID = uid;
  postRef = dataRef.child(uid);
  var title, content, date;

  postRef.on('value', function(snapshot){
    var rows = [];
    snapshot.forEach(function(childSnap){
      var key = snapshot.key();
      var comment = childSnap.val();
      var $commentRow = $("<div>");
      $commentRow.text(comment.dateTime + ":  " + comment.content);
      rows.push($commentRow);
    });
    var slicedRows = rows.slice(0, rows.length - 3);

    $("#comments").empty().append(slicedRows);
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
  var dateTime = moment(Date.now()).format('MMMM Do YYYY');
  comment.content = $('#answer').val();
  comment.dateTime = dateTime;
  postRef.push(comment);
  $("#answer").val("");
}

//turn off the click eventer that was opened, in order to prevent the modal box
// from changing if someone is answering a DIFFERENT question concurrently
function answerModalClosed(){
  var currentKey = globalUID;
  dataRef.child(currentKey).off();
}
