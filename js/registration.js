function sendMail() {
    let params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        program: document.getElementById("program").value,
        message: document.getElementById("message").value
    };
    
    emailjs.send("service_uqrkbv9", "template_w8bbku9", params)
        .then(() => {
            alert("Registration email sent successfully!");
        })
        .catch((error) => {
            alert("Something went wrong. Please try again.");
            console.log(error);
        });
}
