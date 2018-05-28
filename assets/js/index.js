/*--------firebase get all current user function-------------*/    
var currentUser;

auth.onAuthStateChanged(function(user) {
  if (user) {
        dbRef.ref('/users/' + user.uid).once('value').then(function(snapshot) {
            currentUser = snapshot.val();
            var username = (snapshot.val() && snapshot.val().first_name) || 'Anonymous';
            $("#current_user").text(username);
            $("#current_user_name").text(currentUser.first_name+" "+currentUser.last_name);
            $("#user_status").text("Status : "+currentUser.is_active);
        });
      
      
        dbRef.ref('friends/'+user.uid).once("value").then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {

              var childData = childSnapshot.val();

                if(childData !== null ){
                    if(childData.status == 0 ){
                    var friendlisthtml='<li class="list-group-item h-25 w-100 p-3 ">'; 
                        friendlisthtml+='<span class="request_user_email">Email : '+childData.to_uid+'</span><br>';
                        friendlisthtml+='<span class="request_user_uid d-none">'+childData.to_uid+'</span>';
                        friendlisthtml+='<button type="button" class="btn btn-success btn-sm btn-accept" onclick="acceptRequest(this)">Accept</button>';
                        friendlisthtml+='<button type="button" class="btn btn-danger btn-sm btn-reject" onclick="rejectRequest(this)">Reject</button>';
                        friendlisthtml+='</li>';
                    $("#request_user").append(friendlisthtml);
                }
             }
          });
        });
      
            dbRef.ref('friends/'+user.uid).once("value").then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {

              var childData = childSnapshot.val();

                if(childData !== null ){
                    if(childData.status == 1 ){
                    var friendlisthtml='<li class="list-group-item h-25 w-100 p-3 ">'; 
                        friendlisthtml+='<span class="request_user_email">Email : '+childData.to_uid+'</span><br>';
                        friendlisthtml+='<span class="request_user_uid d-none">'+childData.to_uid+'</span>';
                        friendlisthtml+='</li>';
                    $("#friend_user").append(friendlisthtml);
                }
             }
          });
        });
      
      
  } else {
        window.location.replace("user_login.html");
  }
});

/*--------firebase logout function-------------*/
$("#logout").on("click", function(){
    auth.signOut().then(function() {
        
        dbRef.ref('/users/' + currentUser.user_uid).update({is_active: "Offline"});
        
        window.location.replace("user_login.html");
    }, function(error) {
        console.log("An error happened.");
    });
});

/*---------------don't change up--------------------------*/


/*--------firebase get all user function-------------*/

dbRef.ref("/users").once("value").then(function(snapshot) {
    
    snapshot.forEach(function(childSnapshot) {
        
      var childData = childSnapshot.val();
        
        if(childData !== null ){
            var friendlisthtml='<li class="list-group-item h-25 w-100 p-3 ">'; 
                friendlisthtml+='<span class="user_name text-info font-weight-bold">Name : '+childData.first_name+' '+childData.last_name+'</span><br>';
                friendlisthtml+='<span class="user_email">Email : '+childData.email+'</span><br>';
            if(childData.is_active==="Online"){
                friendlisthtml+='<span class="user_status text-success">Status : '+childData.is_active+'</span><br>';
            } else {
                friendlisthtml+='<span class="user_status text-danger">Status : '+childData.is_active+'</span><br>';
            } 
                friendlisthtml+='<span class="user_uid d-none">'+childData.user_uid+'</span>';
                friendlisthtml+='<button type="button" class="btn btn-success btn-sm btn-friend-request">Send Request</button>';
                friendlisthtml+='</li>';
            
            $("#add_user").append(friendlisthtml)
        }
  });
});

  
$(".list-group").on("click", ".list-group-item .btn-friend-request", function(){
    var reqUID =$(this).closest('li').find(".user_uid").text();
    var myRequestData = {
        from_uid :  currentUser.user_uid,
        status : "0",
        to_uid : reqUID
    }
    var toRequestData = {
        from_uid :  reqUID,
        status : "0",
        to_uid : currentUser.user_uid
    }
    
      dbRef.ref('friends/'+currentUser.user_uid+'/' + reqUID)
                    .set(myRequestData)
                    .then(function(){
                        console.log("first insert");
      });
    
     dbRef.ref('friends/'+reqUID+'/' + currentUser.user_uid)
                .set(toRequestData)
                .then(function(){
                    console.log("second insert");
     });
    
});


function acceptRequest(el){
    var reqUID =$(el).closest('li').find(".request_user_uid").text();
       dbRef.ref('friends/'+currentUser.user_uid+'/' + reqUID)
                    .update({status : "1"})
                    .then(function(){
                        console.log("first updated");
      });
    
     dbRef.ref('friends/'+reqUID+'/' + currentUser.user_uid)
                .update({status : "1"})
                .then(function(){
                    console.log("second updated");
     });
    
}

function rejectRequest(el){
    var reqUID =$(el).closest('li').find(".request_user_uid").text();
    dbRef.ref('friends/'+currentUser.user_uid+'/' + reqUID)
                    .update({status : "3"})
                    .then(function(){
                        console.log("first updated");
    });
    
     dbRef.ref('friends/'+reqUID+'/' + currentUser.user_uid)
                .update({status : "3"})
                .then(function(){
                    console.log("second updated");
     });
}



/* $( "body" ).on( "click", "p", function() {
  $( this ).after( "<p>Another paragraph! " + (++count) + "</p>" );
}); */  

  //-------------------------------------------------  

var messageRef = dbRef.ref('messages');
   

/*var messageRef = new Firebase('https://gossipweb-e1ec6.firebaseio.com/messages');*/
    
$('#messageInput').keypress(function(e){
   if(e.keyCode == 13) {
       
var to_uid = $('#nameInput').val();
var from_uid = currentUser.uid;
var text = $('#messageInput').val();
       
  messageRef.push({to_uid:to_uid, from_uid:from_uid, text:text});
  // messageRef.child('currentMessage');
  $('#messageInput').val();
   }

});

messageRef.on('child_added',function(snapshot){
   var message = snapshot.val();
  console.log(message);
  document.getElementById('messageDiv').innerHTML += message.to_uid+'--'+message.text+'<br/>';

});

