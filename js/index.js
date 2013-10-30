var messageBox = document.getElementById("message");
var $submitButton = $("#submit");

var $login = $("#login");
var $chat = $("#chat");
var $chatRequest = $("#chatRequest");

var $request = $("#request");
var $requestButton = $("#requestButton");
var $messages = $("#messages");
var $message = $("#errand");
var $sendButton = $("#send");
var $closeChat = $("#closeChat");

var myUserName;

var destinationId;

var server = 'http://websocketchat-c9-erreh.c9.io/chat';

var chat = {
    start: function () {
        var chatServer = new SockJS(server, null, {debug: true, devel: true});

        chatServer.onopen = function() {
            console.log('open');
            chat.createEvents(chatServer);
        };
        
        chatServer.onclose = function() {
        	console.log('close');
        	$submitButton.off('click');
        	$requestButton.off('click');
        	$closeChat.off('click');
        	$sendButton.off('click');
        	chat.start();
        };
        
        $("section").hide();
        $login.show();
        
        chatServer.onmessage = function (response) {
            var message = JSON.parse(response.data);
            var event = message.event;
            switch (event) {
                case "user ok":
                    $login.hide();
                    $chatRequest.show();
                    break;
                case "request ok":
                    $chatRequest.hide();
                    $chat.show();
                    destinationId = message.data.userId;
                    break;
                case "message":
                    var chatMessage = message.data.message;
                    var userName = message.data.userName;
                    var m = "<p><strong>" + userName + "</strong>";
                        m += " " + chatMessage + "</p>";
                    $messages.append(m);
                    break;
                case "error":
                    var code = message.data.errorCode;
                    var errorMessage = message.data.errMessage;
                    messageBox.innerText = code + " : " + errorMessage; 
                    break;
                default:
                    
                    break;
            }
        };
    },
    
    createEvents: function(chatServer) {
        $submitButton.click(function() {
            var userName = $("#userName").val();
            var message = {
                "event": "new user",
                "data" : {
                    "userName" : userName
                }
            }
            chatServer.send(JSON.stringify(message));
            myUserName = userName;
        });
        
        $requestButton.click(function() {
            var request = $request.val();
            var message = {
                "event" : "requestChat",
                "data" : {
                    "destination" : request
                }
            };
            
            chatServer.send(JSON.stringify(message));
        });
        
        $closeChat.click(function() {
        	chatServer.close();
        	$("section").hide();
        	$login.show();
        });
        
        $sendButton.click(function() {
            var content = $message.val();
            var message = {
                "event" : "message",
                "data" : {
                    "message" : content,
                    "destinationId": destinationId
                }
            };
            
            chatServer.send(JSON.stringify(message));
            
            var chatMessage = content;
            var userName = myUserName;
            var m = "<p><strong>" + userName + "</strong>";
                m += " " + chatMessage;
            
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1;
            var yyyy = today.getFullYear();
            var hr = today.getHours();
            var mins = today.getMinutes();
            var secs = today.getSeconds();
            if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
            var fullDate ="at "+dd+"/"+mm+"/"+yyyy+" "+hr+":"+mins+":"+secs;
            
                m += " " + fullDate + "</p>";
            
            $messages.append(m);
            
            $message.val("");
            
        });
    }
};

chat.start();