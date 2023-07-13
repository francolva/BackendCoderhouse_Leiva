console.log('Calling chat.js');

const socket = io();

document.addEventListener("DOMContentLoaded", () => {
    let chatBox = document.getElementById("chatBox");
    let user;

    Swal.fire({
        title: "¡Bienvenido!",
        input: "text",
        text: "Ingrese su nombre de usuario",
        inputValidator: (value) => {
            return !value && "Por favor, ingrese su nombre de usuario";
        },
        allowOutsideClick: false
    }).then(result => {
        user = result.value;
        socket.emit("client:userLogged", user);
    }).then(() => {
        socket.on("server:userLogged", (user) => {
            Swal.fire({
                text: `${user.user} se ha conectado`,
                toast: true,
                position: "top-right",
                timer: 5000,
                hideClass: {
                    popup: 'animated fadeOutUp faster',
                  }
            })
        });

        socket.on("server:messageLogs", data => {
            let log = document.getElementById("messageLogs");
            let messages = "";
            data.forEach(message => {
                messages = messages + `${message.user} dice: ${message.message}</br>`
            });
            log.innerHTML = messages;
        });
    })

    chatBox.addEventListener("keyup", evt => {
        if(evt.key === "Enter") {
            if(chatBox.value.trim().length > 0) {
                socket.emit("client:message", {user:user, message:chatBox.value});
                chatBox.value = "";
            };
        };
    });
});