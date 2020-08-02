var currentUserKey = '';
var chatKey = '';
var friend_id = '';

const chatList = document.querySelector("#chat-message-list");
function OneKeyDown() {
    document.addEventListener('keydown', function (key) {
        if (key.which === 13) {
            var inputMessage = document.querySelector("#inputMessage").value;
            if (inputMessage !== "") {
                SendMessage(inputMessage);
            }
        }
    });
}

// Main
const txtEmail = document.querySelector("#txtEmail");
const txtPassword = document.querySelector("#txtPassword");
const loginBtn = document.querySelector("#login-btn");
const signUpBtn = document.querySelector("#signup-btn");
const logOutBtn = document.querySelector("#logout-btn");
const newChatBtn = document.querySelector("#new-chat");
const userName = document.querySelector("#user-name");
const menuBtn = document.querySelector("#menu-btn");
const avatar = document.querySelector("#avatar");
const formInput = document.querySelector(".form-input");
const menuDropdown = document.querySelector(".dropdown-menu");
const listFriends = document.querySelector(".popularFriends");
const listFriendsContainer = document.querySelector(".friends-container");
const chatMessageList = document.querySelector("#chat-message-list");
const conversationLists = document.querySelector("#conversation-list");
const tabs = document.querySelectorAll("#myTab li");
const sendRecorder = document.querySelector("#send-recorder");

tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove("active-tab");
        }
        tab.classList.add("active-tab");
    });
});

menuBtn.addEventListener("click", function () {
    menuDropdown.classList.toggle("hidden");
});

listFriends.addEventListener("click", function (e) {
    if (e.target !== listFriends) {
        listFriends.classList.add("hidden");
    }
});

function loadChatList() {
    var db = firebase.database().ref('friend_list');
    db.on('value', function (lists) {
        lists.forEach(function (data) {
            var lst = data.val();
            var friendKey = '';
            if (lst.friendId === currentUserKey) {
                friendKey = lst.userId;
            } else if (lst.userId === currentUserKey) {
                friendKey = lst.friendId;
            }
            if (friendKey !== "") {
                firebase.database().ref('users').child(friendKey).on('value', function (data) {
                    var user = data.val();
                    conversationLists.innerHTML += `<div class="conversation" data-currentFriendKey="" onclick="startChat('${data.key}', '${user.name}', '${user.photoURL}')">
                    <img src="${user.photoURL}" alt=" ${user.name}">
                    <div class="title-text">
                    ${user.name}
                    </div>
                    <div class="created-date">
                        Apr 16
                    </div>
                    <div class="conversation-message">
                        This is a message
                    </div>
                </div>`;
                });
            }
        });
    });
}

//=======Search user name - ERROR===========
var conversationList = document.querySelectorAll(".conversation");
function searching(keyword) {
    console.log(keyword);
    for (let i = 0; i < conversationList.length; i++) {
        title = conversationList[i].querySelector(".title-text");
        txtValue = title.textContent || title.innerText;
        if (txtValue.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
            conversationList[i].style.display = "";
        } else {
            conversationList[i].style.display = "none";
        }
    }
}

newChatBtn.addEventListener("click", function () {
    listFriends.classList.remove("hidden");
    // listFriends.innerHTML = `<img src="img/loading.gif" alt="">`;

    var lst = '';
    var db = firebase.database().ref('users');
    db.on('value', function (users) {
        if (users.hasChildren()) {
            lst = `<li><p>List Friends</p></li>
            <li><input type="text" placeholder="Search" style="padding: 10px; outline: none;"></li>  `;
        }
        users.forEach(function (data) {
            var user = data.val();
            if (user.email !== firebase.auth().currentUser.email) {
                lst += ` <li class="friend" data-dismiss="modal" onclick="startChat('${data.key}', '${user.name}', '${user.photoURL}')">
                <img src="${user.photoURL}" alt="${user.name}" style="width: 50px; height: auto; border-radius: 100%;">
                <span class="friend-name">${user.name}</span>                      
            </li>`;
            }
        });
        listFriendsContainer.innerHTML = lst;
    });
});

function startChat(friendKey, friendName, friendPhoto) {
    var friendList = { friendId: friendKey, userId: currentUserKey };
    friend_id = friendKey;

    var flag = false;
    var db = firebase.database().ref('friend_list');
    db.on('value', function (friends) {
        friends.forEach(function (data) {
            var user = data.val();
            if ((user.friendId === friendList.friendId && user.userId === friendList.userId) || (user.friendId === friendList.userId && user.userId === friendList.friendId)) {
                flag = true;
                chatKey = data.key;
            }
        });
        if (flag === false) {
            chatKey = firebase.database().ref('friend_list').push(friendList, function error() {
                if (error) alert(error);
                else {
                    chatMessageList.setAttribute("style", "display:none")
                }
            }).getKey();
        } else {
            chatMessageList.removeAttribute("style");
        }
        // Display friend name & photo
        // document.querySelector("#imgChat").src = friendPhoto;
        document.querySelector("#divChatName").textContent = friendName;
        // chatList.innerHTML = '';
        // Display the chat messages
        loadChatMessages(chatKey, friendPhoto);
    });
}

function loadChatMessages(chatKey, friendPhoto) {
    var db = firebase.database().ref('chatMessages').child(chatKey);
    // var db_friend = firebase.database().ref('users');
    var messageDisplay = '';
    db.on('value', function (chats) {
        chats.forEach(function (data) {
            var chat = data.val();
            var msg = '';
            var dateTime = chat.dateTime.split(",");
            // Message type
            if (chat.msgType === "image") {
                msg = `<img src='${chat.msg}' class="img-fluid">`;
            } else if (chat.msgType === "audio") {
                msg = `<audio controls>
                    <source src="${chat.msg}" type="video/webm"/>
                    </audio>`;
            }
            else {
                msg = chat.msg;
            }
            if (chat.userId !== currentUserKey) {
                messageDisplay += `<div class="message-row other-message">
                <div class="message-content">
                    <img src="${friendPhoto}" alt="User name">
                    <div class="message-text">${msg}</div>
                    <div class="message-time"><span title="${dateTime[0]}">${dateTime[1]}</span></div>
                </div>
            </div>`;
            } else {
                messageDisplay += `<div class="message-row you-message">
                <div class="message-content">
                    <div class="message-text">${msg}</div>
                    <div class="message-time"><span title="${dateTime[0]}">${dateTime[1]}</span></div>
                </div></div>`;
            }
        });
        chatList.innerHTML = messageDisplay;
        // Scroll to the bottom when added more message
        chatList.scrollTo(0, chatList.scrollHeight);
    });
}

function SendMessage(inputMessage) {
    var chatMessage = { userId: currentUserKey, msg: inputMessage, msgType: "text", dateTime: new Date().toLocaleString() };
    // alert(chatKey);
    firebase.database().ref('chatMessages').child(chatKey).push(chatMessage, function (error) {
        if (error) alert(error);
        else {
            // Notification
            firebase.database().ref('fcmTokens').child(friend_id).once('value').then(function(data){
                $.ajax({
                    url: 'https://fcm.googleapis.com/fcm/send',
                    header: {
                        'Content-Type': 'application/json',
                        'Authorization': 'z2NNd40CSUpLPlAWVwSdwWchhuNmyEnE2Hu0XOFH'
                    },
                    data: JSON.stringify({
                        'to': data.val().token_id,
                        'data': {'message': chatMessage.msg.substring(0, 30)}
                    }),
                    success: function(response){
                        console.log(response);
                    },
                    error: function(xhr, status, error){
                        console.log(xhr.error);
                    }
                });
            });

            // var message = `<div class="message-row you-message" >
            // <div class="message-content">
            //     <div class="message-text">${inputMessage}</div>
            //     <div class="message-time"><span title="${GetCurrentDate()}">${GetCurrentTime()}</span></div>
            // </div></div>`;
            // chatList.innerHTML += message;
            document.querySelector("#inputMessage").value = "";
            document.querySelector("#inputMessage").focus();
            // // Scroll to the bottom when added more message
            // chatList.scrollTo(0, chatList.scrollHeight);
            // // Or another way
            // // window.setTimeout(function () {
            // //     chatList.scrollTop = chatList.scrollHeight;
            // // }, 100);
        }
    });
}

//======Send image==========
function chooseImage() {
    document.querySelector("#uploadFile").click();
}

function sendImage(event) {
    var file = event.files[0];
    if (!file.type.match("image.")) {
        alert("Please select image only!");
    } else {
        var reader = new FileReader();

        reader.addEventListener("load", function () {
            var chatMessage = { userId: currentUserKey, msg: reader.result, msgType: "image", dateTime: new Date().toLocaleString() };
            // alert(chatKey);
            firebase.database().ref('chatMessages').child(chatKey).push(chatMessage, function (error) {
                if (error) alert(error);
                else {
                    document.querySelector("#inputMessage").value = "";
                    document.querySelector("#inputMessage").focus();
                }
            });
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
    }
}

//======Emoji==========
loadEmoji();
function loadEmoji() {
    var emojiArray = '';
    for (let i = 128512; i <= 128580; i++) {
        emojiArray += `<a onclick="getEmoji(this);" style="cursor: pointer">&#${i}</a>`;
    }
    document.querySelector("#smiley").innerHTML = emojiArray;
}

function showEmojiPanel() {
    document.querySelector("#emoji").removeAttribute("style");
}

function hideEmojiPanel() {
    document.querySelector("#emoji").setAttribute("style", "display:none");
}

function getEmoji(control) {
    document.querySelector("#inputMessage").value += control.innerHTML;
}

//======Change Icon========
function changeIcon(text) {
    if (text.value !== "") {
        document.querySelector("#send-icon").removeAttribute("style");
        document.querySelector("#send-recorder").setAttribute("style", "display: none");
    } else {
        document.querySelector("#send-recorder").removeAttribute("style");
        document.querySelector("#send-icon").setAttribute("style", "display: none");
    }
}

//=======Audio Recorder=======
let chunks = [];
let recorder;
var timeOut;

function record(control) {
    let device = navigator.mediaDevices.getUserMedia({ audio: true });
    // Create new recorder
    device.then(stream => {
        if (recorder === undefined) {
            recorder = new MediaRecorder(stream);
            recorder.ondataavailable = e => {
                chunks.push(e.data);

                if (recorder.state === 'inactive') {
                    let blob = new Blob(chunks, { type: 'audio/webm' });
                    var reader = new FileReader();

                    reader.addEventListener("load", function () {
                        var chatMessage = { userId: currentUserKey, msg: reader.result, msgType: "audio", dateTime: new Date().toLocaleString() };
                        // alert(chatKey);
                        firebase.database().ref('chatMessages').child(chatKey).push(chatMessage, function (error) {
                            if (error) alert(error);
                            else {
                                document.querySelector("#inputMessage").value = "";
                                document.querySelector("#inputMessage").focus();
                            }
                        });
                    }, false);
                    reader.readAsDataURL(blob);
                }
            }
            recorder.start();
            control.innerHTML = '<i class="fas fa-stop"></i>';
            console.log(recorder);
        }
    });
    if (recorder !== undefined) {
        if (control.getAttribute("class").indexOf("start") !== -1) {
            recorder.stop();
            control.setAttribute("class", "start");
            control.innerHTML = "<i class='fas fa-microphone'></i>";
        } else {
            chunks = [];
            recorder.start();
            control.setAttribute("class", "stop");
            control.innerHTML = "<i class='fas fa-stop'></i>";
        }
    }
}

//=====Get Current Time=======
function GetCurrentTime() {
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = `${hours}:${minutes}:${ampm}`;
    // console.log(minutes);
    return strTime;
}

function GetCurrentDate() {
    return `${(new Date().getMonth() + 1)}/${new Date().getDate()}/${new Date().getFullYear()}`;
}

// Logout Event
logOutBtn.addEventListener("click", function () {
    firebase.auth().signOut();
});

// Sign up Event
signUpBtn.addEventListener("click", function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
});

// Add a realtime listener
function onFirebaseStateChanged() {
    firebase.auth().onAuthStateChanged(onStateChanged);
}

function onStateChanged(user) {
    if (user) {
        alert(firebase.auth().currentUser.email + '\n' + firebase.auth().currentUser.displayName);
        var userProfile = { email: '', name: '', photoURL: '' };
        userProfile.email = firebase.auth().currentUser.email;
        userProfile.name = firebase.auth().currentUser.displayName;
        userProfile.photoURL = 'https://drive.google.com/uc?export=view&id=1no2rfns_5ttsKXTvcSj7oLQa8q-JSl0w';

        var db = firebase.database().ref('users');
        var flag = false;
        db.on('value', function (users) {
            users.forEach(function (data) {
                var user = data.val();
                if (user.email === userProfile.email) {
                    currentUserKey = data.key;
                    flag = true;
                }
            });
            if (flag) {
                avatar.src = 'https://drive.google.com/uc?export=view&id=1no2rfns_5ttsKXTvcSj7oLQa8q-JSl0w';
                userName.textContent = firebase.auth().currentUser.displayName;
                YES_Login();
            } else {
                firebase.database().ref("users").push(userProfile, callback);
            }

            //=====Notifications=======
            const messaging = firebase.messaging();
            messaging.requestPermission().then(function () {
                return messaging.getToken();
            }).then(function (token) {
                firebase.database().ref('fcmTokens').child(currentUserKey).set({token_id: token});
            });

            // Load chat list
            loadChatList();
        });
    } else {
        avatar.src = 'https://drive.google.com/uc?export=view&id=1QYTjh3aJ0GUzefZxy1XJn3xeR1A0U0xw';
        userName.textContent = "User name";
        conversationLists.innerHTML = "";
        chatList.innerHTML = '';
        NO_Login();
    }
}

function callback(error) {
    if (error) {
        alert(error);
    } else {
        alert("Login succeeded!");
        YES_Login();
    }
}

function YES_Login() {
    formInput.classList.add("hidden");
    loginBtn.classList.add("hidden");
    signUpBtn.classList.add("hidden");
    newChatBtn.classList.remove("hidden");
    logOutBtn.classList.remove("hidden");
}

function NO_Login() {
    formInput.classList.remove("hidden");
    loginBtn.classList.remove("hidden");
    signUpBtn.classList.remove("hidden");
    newChatBtn.classList.add("hidden");
    logOutBtn.classList.add("hidden");
}

// Login Event
// loginBtn.addEventListener("click", function () {
//     var email = txtEmail.value;
//     var password = txtPassword.value;

//     firebase.auth().signInWithEmailAndPassword(email, password)
//         .catch(function (error) {
//             // Handle Errors here.
//             var errorCode = error.code;
//             var errorMessage = error.message;
//             if (errorCode === 'auth/wrong-password') {
//                 alert('Wrong password.');
//             } else {
//                 alert(errorMessage);
//             }
//             console.log(error);
//         });
// });

// Call auth State changed
onFirebaseStateChanged();

