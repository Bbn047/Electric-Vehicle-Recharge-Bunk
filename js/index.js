const loginBtn = document.getElementById("login");
if(loginBtn){
  loginBtn.addEventListener("click", () =>{
    window.location.href = "login.html";
  });
}

const signupBtn = document.getElementById("sign-up");
if(signupBtn){
  signupBtn.addEventListener("click", () =>{
    window.location.href = "register.html";
  });
}

const start = document.getElementById("get-start");
if(start){
  start.addEventListener("click", () =>{
    window.location.href = "login.html";
  });
}