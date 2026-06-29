const form=document.getElementById("loginForm");
const message = document.getElementById("message");
form.addEventListener("submit",function(event){
    event.preventDefault();

    const email= document.getElementById("email").value.trim();

    const password= document.getElementById("password").value.trim();
    if (email ===""||password===""){
        message.style.color = "red";
        message.textContent = "Please fill in all fields";
        return;
    }
    const savedEmail = "user@gmail.com";
    const savedPassword = "123456";

    if(email ===savedEmail && password===savedPassword){
        message.style.color= "green";
        message.textContent= "Login successful!"

        setTimeout(() =>{
            window.location.href= 'officer.html';
        },2000);
    }else{
        message.style.color= "red";
        message.textContent= "Invalid email or password.";
    }
})