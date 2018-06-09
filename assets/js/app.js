 var currentUser;


/* -------------- get currentUser and his/her friendlist and so ------------------ */
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

        usersRef.doc(user.uid).get().then(function (doc) {

            if (doc.exists) {
                
                // ---- current user data
                currentUser = doc.data();
                var userFullName = currentUser.first_name + " " + currentUser.last_name;
                if(currentUser.is_active == "FirstLogin"){
                    $(".welcome-screen").addClass("hidden");
                    $(".first-screen").removeClass("hidden");
                   /* $("#user_profile_name").text(userFullName);*/
                    usersRef.doc(currentUser.uid).update({
                        "is_active": "Online"
                    })
                }else{
                     usersRef.doc(currentUser.uid).update({
                        "is_active": "Online"
                    })                    
                     //$(".welcome-screen").removeClass("hidden");
                }
               $("#user_profile_name").text(userFullName);
                 $("#currenUsersFullName").text(userFullName);
                $("#currenUserStatus").text(currentUser.is_active);
                 $("#statusSignal").addClass("green-dot");

                storageRef.child('images/' + currentUser.photo_url).getDownloadURL().then(function (url) {
                    $("#currentUserImg").attr("src", url);
                });
                
                
                fetchFriendWhoSentRequests();
                fetchFriendWhomISentRequestsTo();


                $(".notification-list").html("");
                dbRef.collection("friendship").where("to_uid", "==", currentUser.uid).where("status", "==", 1)
                    .onSnapshot(function (snapshot) {
                        if (snapshot.size != 0) {
                            $("#notificationCount").text(snapshot.size);
                        } else {
                            $("#notificationCount").text("");
                        }
                        snapshot.docChanges().forEach(function (change) {
                            if (change.type === "added") {
                                usersRef.doc(change.doc.data().from_uid).get().then(function (doc) {

                                    if (doc.exists) {
                                        var childData = doc.data();
                                        storageRef.child('images/' + childData.photo_url).getDownloadURL().then(function (url) {
                                            var searchlisthtml = '<li class="friend">' 
                                                      + '<div class="friend-body">'
                                                      +	'<img id="friend_user_image" class="user-image" src="'+url+'" alt="">'
                                                      +	'<div class="user-info"><p id="" class="user-full-name">'+childData.first_name+ ' ' +childData.last_name+'</p>'
                                                      +	'<input type="hidden" class="user-uid" value="'+childData.uid+'"/>'
                                                      +	'<input type="hidden" class="from-uid" value="'+change.doc.data().from_uid+'"/>'
                                                      +	'<input type="hidden" class="friendship-uid" value="'+change.doc.id+'"/>'
                                                      +	'<input type="hidden" class="user-status" value="'+childData.is_active+'"/>'
                                                      + '<p class="user-thought">Whats up guys</p></div>'
                                                      + '<div class="request-status">'
                                                      + '<button type="submit" class="btn btn-success btn-raised btn-fab btn-round acceptBtn"><i class="material-icons">done</i></button>'
                                                      + '<button type="submit" class="btn btn-danger btn-raised btn-fab btn-round rejectBtn"><i class="material-icons">close</i></button>'
                                                      + '</div>'
                                                      + '</div>'
                                                      + '</li>';

                                            $(".notification-list").append(searchlisthtml);

                                        });
                                    }
                                })
                            }
                        });
                    });

            } else {
                console.log("No such document!");
            }

        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

    } else {
        loadPage("pages/login.html");
    }
});

function fetchFriendWhoSentRequests() {

    dbRef.collection("friendship").where("to_uid", "==", currentUser.uid).where("status", "==", 2)
        .onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(function (change) {
                // current_user in from and in to
                
                if (change.type === "added") {

                     usersRef.doc(change.doc.data().from_uid).get().then(function (doc) {

                        if (doc.exists) {
                            var childData = doc.data();
                            var status;
                            if(childData.is_active == "Online"){ 
                                status =  '<span class="dot green-dot"></span>';
                            }else if(childData.is_active == "Offline"){
                                status = '<span class="dot grey-dot"></span>';
                            }
                            storageRef.child('images/' + childData.photo_url).getDownloadURL().then(function (url) {
                                var friendlisthtml = '<li class="friend">' 
                                          + '<div class="friend-body">'
                                          +	'<img id="friend_user_image" class="user-image" src="'+url+'" alt="">'
                                          +	'<div class="user-info"><p id="" class="user-full-name">'+childData.first_name+ ' ' +childData.last_name+'</p>'
                                          +	'<input type="hidden" class="user-uid" value="'+childData.uid+'"/>'
                                          +'<input type="hidden" class="friendship-id" value="'+change.doc.id+'"/>'
                                          +	'<input type="hidden" class="user-status" value="'+childData.is_active+'"/>'
                                          + '<p class="user-thought">Whats up guys</p></div>'
                                          + '<div class="user-status"><span class="user-activity"></span>'+ status +'</div>'
                                          + '</div>'
                                          + '</li>';

                                $(".friend-list").append(friendlisthtml);
                                friendlisthtml = "";
                            });
                        }
                    })


                }

            });
        });
}
function fetchFriendWhomISentRequestsTo() {

    dbRef.collection("friendship").where("from_uid", "==", currentUser.uid).where("status", "==", 2)
        .onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(function (change) {

                if (change.type === "added") {
       
                    usersRef.doc(change.doc.data().to_uid).get().then(function (doc) {
                        
                        if (doc.exists) {
                            var childData = doc.data();
                            var status;
                            if(childData.is_active == "Online"){ 
                                status =  '<span class="dot green-dot"></span>';
                            }else if(childData.is_active == "Offline"){
                                status = '<span class="dot grey-dot"></span>';
                            }
                            storageRef.child('images/' + childData.photo_url).getDownloadURL().then(function (url) {
                                var friendlisthtml = '<li class="friend">' 
                                          + '<div class="friend-body">'
                                          +	'<img id="friend_user_image" class="user-image" src="'+url+'" alt="">'
                                          +	'<div class="user-info"><p id="" class="user-full-name">'+childData.first_name+ ' ' +childData.last_name+'</p>'
                                          +	'<input type="hidden" class="user-uid" value="'+childData.uid+'"/>'
                                          + '<input type="hidden" class="friendship-id" value="'+change.doc.id+'"/>'
                                          +	'<input type="hidden" class="user-status" value="'+childData.is_active+'"/>'
                                          + '<p class="user-thought">Whats up guys</p></div>'
                                          + '<div class="user-status"><span class="user-activity"></span>'+ status + '</div>'
                                          + '</div>'
                                          + '</li>';

                                $(".friend-list").append(friendlisthtml);
                            });
                        }
                    })

                }

            });
        });
}

/* -------------- Friend onclick get chating data with this friend------------------ */

 $(".friend-list").on("click", '.friend', function(e){ 
    if ($('.chat-screen').hasClass("hidden")) {
        $('.welcome-screen').addClass("hidden");
        $('.chat-screen').removeClass("hidden");
    }

    var friendUID = $(this).find(".user-uid").val();
    var friendshipID = $(this).find(".friendship-id").val();
    var friendName = $(this).find(".user-full-name").text();
    var friendStatus = $(this).find(".user-status").val();
    var friendPhotoUrl = $(this).find(".user-image").attr('src');

    $("#friend_name").text(friendName);
    $("#friend_status").text(friendStatus);
    $("#friend_uid").val(friendUID);
    $("#friendship_id").val(friendshipID);
    $("#friend_image").attr("src", friendPhotoUrl);

    $(".chat-screen .body").html("");
    var html = ""; 
     dbRef.collection('messages').orderBy("msgtime").where("friendship_id", "==", friendshipID).limit(20).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) { 
            
            var htmlContent = "";
            if (doc.data().from_uid != currentUser.uid) {
                if(doc.data().fileurl.length >0){
                           html += '<div class="friend-chat">'
                        +'<img id="" class="selected-user-image" src="'+friendPhotoUrl+'" alt="">'
                        +'<div class="selected-user-info">'
                        + '<p id=""><span class="selected-user-full-name">'+friendName+'</span>&nbsp;&nbsp;'
                        +'<time class="chat-time">'+doc.data().time+'</time></p>'
                        +'<p class="selected-user-chat">'+doc.data().fileurl+'</p></div>'
                        +'</div>';
                }else{
                           html += '<div class="friend-chat">'
                        +'<img id="" class="selected-user-image" src="'+friendPhotoUrl+'" alt="">'
                        +'<div class="selected-user-info">'
                        + '<p id=""><span class="selected-user-full-name">'+friendName+'</span>&nbsp;&nbsp;'
                        +'<time class="chat-time">'+doc.data().time+'</time></p>'
                        +'<p class="selected-user-chat">'+doc.data().text+'</p></div>'
                        +'</div>';
                }
         
            } else {
                if(doc.data().fileurl.length >0){
                      html += '<div class="my-chat">'
                        +'<div class="selected-user-info">'
                        + '<p class="text-right">'
                        + '<time class="chat-time">'+doc.data().time+' </time> &nbsp;&nbsp;'
                        +'<span class="selected-user-full-name">'+$("#currenUsersFullName").text()+'</span>'
                        + '</p>'
                        +'<p class="selected-user-chat text-right pull-right">'+doc.data().fileurl+'</p></div>'
                        +'<img id="" class="selected-user-image" src="'+$("#currentUserImg").attr('src')+'" alt="">'
                        +'</div>';
                }else{
                      html += '<div class="my-chat">'
                        +'<div class="selected-user-info">'
                        + '<p class="text-right">'
                        + '<time class="chat-time">'+doc.data().time+' </time> &nbsp;&nbsp;'
                        +'<span class="selected-user-full-name">'+$("#currenUsersFullName").text()+'</span>'
                        + '</p>'
                        +'<p class="selected-user-chat text-right pull-right">'+doc.data().text+'</p></div>'
                        +'<img id="" class="selected-user-image" src="'+$("#currentUserImg").attr('src')+'" alt="">'
                        +'</div>';
                }
              
            }
          
        });
         $(".chat-screen .body").html(html); 
         $(".chat-screen .body").animate({scrollTop: $(".chat-screen .body").prop("scrollHeight")}, 1000);
    });
 
     
/*-----start---------------get realtime messages data-----------------------------*/ 
    var q = dbRef.collection('messages').orderBy("msgtime").where("friendship_id", "==", $("#friendship_id").val());
     q.onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
           // if (change.doc.type === "added") { 
                
                var newMsg = "";
                if(change.doc.data().from_uid == $("#friend_uid").val()){
                     if(change.doc.data().fileurl.length >0){
                            newMsg = '<div class="friend-chat">'
                                +'<img id="" class="selected-user-image" src="'+friendPhotoUrl+'" alt="">'
                                +'<div class="selected-user-info">'
                                + '<p id=""><span class="selected-user-full-name">'+friendName+'</span>&nbsp;&nbsp;'
                                +'<time class="chat-time">'+change.doc.data().time+'</time></p>'
                                +'<p class="selected-user-chat">'+change.doc.data().fileurl+'</p></div>'
                                +'</div>';
                     }else{
                            newMsg = '<div class="friend-chat">'
                                +'<img id="" class="selected-user-image" src="'+friendPhotoUrl+'" alt="">'
                                +'<div class="selected-user-info">'
                                + '<p id=""><span class="selected-user-full-name">'+friendName+'</span>&nbsp;&nbsp;'
                                +'<time class="chat-time">'+change.doc.data().time+'</time></p>'
                                +'<p class="selected-user-chat">'+change.doc.data().text+'</p></div>'
                                +'</div>';
                     }
                 
                 }/*else if(change.doc.data().to_uid == currentUser.uid){
                    newMsg = '<div class="my-chat">'
                            +'<div class="selected-user-info">'
                            + '<p class="text-right">'
                            + '<time class="chat-time">'+change.doc.data().time+' </time> &nbsp;&nbsp;'
                            +'<span class="selected-user-full-name">'+$("#currenUsersFullName").text()+'</span>'
                            + '</p>'
                            +'<p class="selected-user-chat text-right pull-right">'+change.doc.data().text+"<br>"+friendshipID+'</p></div>'
                            +'<img id="" class="selected-user-image" src="'+$("#currentUserImg").attr('src')+'" alt="">'
                            +'</div>';
                }*/
                $(".chat-screen .body").append(newMsg);
                
            //}
        });
         $(".chat-screen .body").animate({scrollTop: $(".chat-screen .body").prop("scrollHeight")}, 1000); 
    });
    /*-----end---------------get realtime messages data-----------------------------*/     
        
    
});


/* ------------------- Message Send --------------------*/
function sendMessage() {
    if($('#chat-box').val() != "" || imgURL.length > 1){
        var friendUID = $("#friend_uid").val();
        var friendshipID = $("#friendship_id").val();
        var message = $('#chat-box').val();

        var date = moment().format('LL');
        var day = moment().format('dddd');
        var time = moment().format('LT');
        var fileurl = imgURL;
        var msgtime = Date.now();

        var messageData = {
            from_uid: currentUser.uid,
            text: message,
            to_uid: friendUID,
            date: date,
            day: day,
            time: time,
            fileurl: fileurl,
            friendship_id: friendshipID,
            msgtime: msgtime
        }

        dbRef.collection('messages').doc()
            .set(messageData)
            .then(function () {
                console.log("Message Sent");
            });



        $('#chat-box').val("");
        imgURL = "";
        
        if(fileurl.length > 0){
         var  sendhtml =   '<div class="my-chat">'
                        + '<div class="selected-user-info">'
                        + '<p class="text-right">'
                        + '<time class="chat-time">'+time+' </time> &nbsp;&nbsp;'
                        + '<span class="selected-user-full-name">'+$("#currenUsersFullName").text()+'</span>'
                        + '</p>'
          + '<img id="" class="selected-user-image pull-right" src="'+$("#currentUserImg").attr('src')+'" alt="">'
                  + '<img id="" class="selected-user-chat text-right pull-right" style="width : 80px; height :80px;" src="'+fileurl+'" alt="">'
                       
                        + '</div>';

        $(".chat-screen .body").append(sendhtml);
        $(".chat-screen .body").animate({scrollTop: $(".chat-screen .body").prop("scrollHeight")}, 1000);
            
        }else{
        var  sendhtml =   '<div class="my-chat">'
                        + '<div class="selected-user-info">'
                        + '<p class="text-right">'
                        + '<time class="chat-time">'+time+' </time> &nbsp;&nbsp;'
                        + '<span class="selected-user-full-name">'+$("#currenUsersFullName").text()+'</span>'
                        + '</p>'
                        + '<p class="selected-user-chat text-right pull-right">'+message+'</p></div>'
                        + '<img id="" class="selected-user-image" src="'+$("#currentUserImg").attr('src')+'" alt="">'
                        + '</div>';

        $(".chat-screen .body").append(sendhtml);
        $(".chat-screen .body").animate({scrollTop: $(".chat-screen .body").prop("scrollHeight")}, 1000); 
            
        }
        
    }
}


var imgfile;
var imgURL = "";
var sendFile = function(event) {
   imgfile = event.target.files[0];
   var uploadTask = storageRef.child('images/' + imgfile.name).put(imgfile);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
      function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        }, function(error) {
                console.log(error);
        }, function() {
              uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                imgURL = downloadURL;
                sendMessage();
              });
        });
};



$("#send_btn").on("click", function(){
    sendMessage();
})

$('#chat-box').keypress(function (e) {
    if (e.which == 13 && !e.shiftKey) {
        sendMessage();
        e.preventDefault();
        $(".chat-screen .body").animate({scrollTop: $(".chat-screen .body").prop("scrollHeight")}, 1000);
    }
    /*if (e.shiftKey) {
        this.value = this.value+"\n";
    }*/
});



$("#search_box").on("input", function () {
    
    $(".search-list").html("");
    dbRef.collection('users').where("email", "==", $(this).val()).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            if (doc != null && doc.data().uid != currentUser.uid) {
                $("#searchBtn").addClass("hidden");
                $(".nav-pill-tabs").addClass("hidden");

                $("#searchCloseBtn").removeClass("hidden");
                $(".search-list").removeClass("hidden");
                var childData = doc.data();
                storageRef.child('images/' + childData.photo_url).getDownloadURL().then(function (url) {
                    var searchlisthtml = '<li class="friend">' 
                                      + '<div class="friend-body">'
                                      +	'<img id="friend_user_image" class="user-image" src="'+url+'" alt="">'
                                      +	'<div class="user-info"><p id="" class="user-full-name">'+childData.first_name+ ' ' +childData.last_name+'</p>'
                                      +	'<input type="hidden" class="user-uid" value="'+childData.uid+'"/>'
                                      +	'<input type="hidden" class="user-status" value="'+childData.is_active+'"/>'
                                      + '<p class="user-thought">Whats up guys</p></div>'
                                      + '<div class="user-status"><span class="user-activity"></span><span class="green-dot"></span></div>'
                                      + '</div>'
                                      + '</li>';

                    $(".search-list").append(searchlisthtml);

                });
            }

        });

        //$(".chat-screen .body").html(html); 
    });
});

$("#searchCloseBtn").on("click", function () {
    $("#searchBtn").removeClass("hidden");
    $(".nav-pill-tabs").removeClass("hidden");

    $("#searchCloseBtn").addClass("hidden");
    $(".search-list").addClass("hidden");

    $(".search-list").html("");
    $("#search_box").val("");

    $("#add_friend").parent().addClass("hidden");
});


 $(".search-list").on("click", '.friend', function (e) {
     if ($('.chat-screen').hasClass("hidden")) {
         $('.welcome-screen').addClass("hidden");
         $('.chat-screen').removeClass("hidden");
     }

     var friendUID = $(this).find(".user-uid").val();
     var friendName = $(this).find(".user-full-name").text();
     var friendStatus = $(this).find(".user-status").val();
     var friendPhotoUrl = $(this).find(".user-image").attr('src');

     $("#friend_name").text(friendName);
     $("#friend_status").text(friendStatus);
     $("#friend_uid").val(friendUID);
     $("#friend_image").attr("src", friendPhotoUrl);

     /*dbRef.collection("friendship").where("to_uid", "==", currentUser.uid).where("status", "==", 1)
       .onSnapshot(function(snapshot) { 
            if(snapshot.size != 0){
             $("#notificationCount").text(snapshot.size);
         }else{
              $("#notificationCount").text("");
         }
       });*/

     $(".chat-screen .body").html("");
     $("#add_friend").parent().removeClass("hidden");

 });

$("#add_friend").on("click", function () {
    var reqUID = $("#friend_uid").val();

    var date = moment().format('LL');
    var day = moment().format('dddd');
    var time = moment().format('LT');
    var timestamp = new Date();

    var friendship = {
        from_uid: currentUser.uid,
        to_uid: reqUID,
        date: date,
        day: day,
        time: time,
        timestamp: timestamp,
        status: 1
    }

    dbRef.collection('friendship').doc()
        .set(friendship)
        .then(function () {

            console.log("request sent");
        });

});

$(".notification-list").on("click", ".acceptBtn", function () {
    var current_li = $(this).closest("li");
    var request_from = current_li.find(".friendship-uid").val();

    dbRef.collection('friendship').doc(request_from).update({
        status: 2
    }).then(function () {
        console.log("Request accepted!");
        current_li.remove();
    });


})

$(".notification-list").on("click", ".rejectBtn", function () {
    var current_li = $(this).closest("li");
    var request_from = current_li.find(".friendship-uid").val();
    dbRef.collection('friendship').doc(request_from).update({
        status: 0
    }).then(function () {
        console.log("Request rejected!");
        current_li.remove();
    });
})


/*--------firebase logout function-------------*/
$(".logout-btn").on("click", function () {
    $(".friend-list").html("");
     usersRef.doc(currentUser.uid).update({
            "is_active": "Offline"
     });
    auth.signOut().then(function () {
        
    }).catch(function (error) {
        // An error happened.
    });
    window.location.href = "index.html";
});


$("#edit-profile-img").on("click", function(){
    $("#browsedImage").trigger("click");
})




var file;
var loadFile = function(event) {
   file = event.target.files[0];
   $("#edit-profile-img").attr("src", URL.createObjectURL(event.target.files[0]));
};



$("#btn_image_send").on("click", function(event){
    $("#sentImage").trigger("click");
})



function imageUpload(file){
    console.log("start ........ " + file.name);
   var uploadTask = storageRef.child('images/' + file.name).put(file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        }, function(error) {
                console.log(error);
        }, function() {
              uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
                window.location.replace("index.html");
              });
        });
}



$("#update_profile").on('click', function(){
var profileData = {
    photo_url : file.name
/*     first_name : "",
    last_name : "",
    username : "",
    recovery_email : "",
    phone : "",
    gender : "",
    birth_date : ""*/
    
}
  usersRef.doc(currentUser.uid)
        .update(profileData)
        .then(function() {
               
                console.log("Profile updated successfully successfully!");
            });
      imageUpload(file);
})




/*
function getCaret(el) { 
    if (el.selectionStart) { 
        return el.selectionStart; 
    } else if (document.selection) { 
        el.focus();
        var r = document.selection.createRange(); 
        if (r == null) { 
            return 0;
        }
        var re = el.createTextRange(), rc = re.duplicate();
        re.moveToBookmark(r.getBookmark());
        rc.setEndPoint('EndToStart', re);
        return rc.text.length;
    }  
    return 0; 
}
$('#chat-box').keyup(function (event) {
    if (event.keyCode == 13) {
        var content = this.value;  
        var caret = getCaret(this);          
        if(event.shiftKey){
            this.value = content.substring(0, caret - 1) + "\n" + content.substring(caret, content.length);
            
        } else {
            //this.value = content.substring(0, caret - 1) + content.substring(caret, content.length);
            sendMessage();
            e.preventDefault();
            
        }
    }
});
*/