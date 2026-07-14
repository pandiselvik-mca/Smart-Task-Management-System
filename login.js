const form = document.getElementById("loginForm");

const email = document.getElementById("email");

const password = document.getElementById("password");

const message = document.getElementById("message");

const toggle = document.getElementById("togglePassword");

toggle.addEventListener("click",()=>{

if(password.type=="password"){

password.type="text";

toggle.innerHTML='<i class="bi bi-eye-slash"></i>';

}
else{

password.type="password";

toggle.innerHTML='<i class="bi bi-eye"></i>';

}

});

form.addEventListener("submit",(e)=>{

e.preventDefault();

let userEmail="admin@gmail.com";

let userPassword="123456";

if(email.value=="" || password.value==""){

message.innerHTML="Please fill all fields";

return;

}

if(email.value==userEmail && password.value==userPassword){

localStorage.setItem("login","true");

window.location="dashboard.html";

}

else{

message.innerHTML="Invalid Email or Password";

}

});