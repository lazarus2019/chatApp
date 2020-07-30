// Search user name
const conversationList = document.querySelectorAll(".conversation");
function searching(keyword) {
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

const chatList = document.querySelector("#chat-message-list");
function OneKeyDown() {
    document.addEventListener('keydown', function (key) {
        if (key.which === 13) {
            var inputMessage = document.querySelector("#inputMessage").value;
            if (inputMessage !== "") {
                SendMessage(inputMessage);
                // Or another way
                chatList.scrollTo(0, chatList.scrollHeight);
                // Scroll to the bottom when added more message
                // window.setTimeout(function () {
                //     chatList.scrollTop = chatList.scrollHeight;
                // }, 100);
            }
        }
    });
}


function GetCurrentTime() {
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = `${hours}:${minutes}:${ampm}`;
    console.log(minutes);
    return strTime;
}

function GetCurrentDate() {
    return `${(new Date().getMonth() + 1)}/${new Date().getDate()}/${new Date().getFullYear()}`;
}

function SendMessage(inputMessage) {
    var message = `<div class="message-row you-message" >
    <div class="message-content">
        <div class="message-text">${inputMessage}</div>
        <div class="message-time"><span title="${GetCurrentDate()}">${GetCurrentTime()}</span></div>
    </div></div>`;
    chatList.innerHTML += message;
    document.querySelector("#inputMessage").value = "";
    document.querySelector("#inputMessage").focus();
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
const formInput = document.querySelector(".form-input");
const menuDropdown = document.querySelector(".dropdown-menu");

menuBtn.addEventListener("click", function () {
    menuDropdown.classList.toggle("hidden");
});

// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        var user = firebase.auth().currentUser;
        var userProfile = { email: '', name: '', photoURL: '' };
        // console.log(user.email);
        userProfile.email = user.email;
        var user_name = user.email.split("@");
        console.log(user_name);
        userProfile.name = user_name[0];
        userProfile.photoURL = 'https://drive.google.com/uc?export=view&id=1no2rfns_5ttsKXTvcSj7oLQa8q-JSl0w';

        firebase.database().ref("users").push(userProfile, callback);
    } else {
        NO_Login();
    }
});

function callback(error) {
    if (error) {
        alert(error);
    } else {
        alert("Login succeeded!");
        if (user != null) {
            alert(user.email);
            userName.textContent = user_name;
        }
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
loginBtn.addEventListener("click", function () {
    var email = txtEmail.value;
    var password = txtPassword.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
});

// Logout Event
logOutBtn.addEventListener("click", function () {
    firebase.auth().signOut();
});

// Sign up Event
signUpBtn.addEventListener("click", function () {
    var email = txtEmail.value;
    var password = txtPassword.value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert("Email da duoc su dung");
            }
        });
});



    // // If you want to using gg account to login
    // signUpBtn.addEventListener("click", function () {
    //     var provider = new firebase.auth.GoogleAuthProvider();
    //     firebase.auth().signInWithPopup(provider);
    // });

    // Another realtime listener
    // function onFirebaseStateChanged() {
    //     firebase.auth().onAuthStateChanged(onStateChanged);
    // }

    // function onStateChanged(user) {
    //     if (user) {
    //         var user_name = user.displayName;
    //         var photoURL = user.photoURL;
    //         userName.textContent = user_name;
    //         }
    //     } else {
    //         alert("Login failed!");
    //     }
    // }