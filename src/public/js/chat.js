const socket = io();

const btnNew = document.getElementById('new')

let user = null;

Swal.fire({
    title: 'Welcome to the chat',
    input: 'email',
    inputLabel: 'Your email address',
    inputPlaceholder: 'Enter your email address',
    inputValidator: (value) => {
        if (!value) {
          return 'You need to write your email!'
        }
    },
    allowOutsideClick: false
}).then(function (value) {
    user = value.value;
})

btnNew.onclick = e => {
    e.preventDefault()
    const message = document.getElementById('message').value
    if (message == '') {
        alert('Debes enviar algun mensaje')
    } else {
        socket.emit('send_message', {
            message,
            user                   
            })
        document.getElementById('message').value = ''
    }
}

socket.on("new_message", data => {
    addDataToItems(data);
})

function addDataToItems(data) {
    const table = document.getElementById('tabla1')
    var row = table.insertRow();
    var date = row.insertCell(0);
    var user = row.insertCell(1);
    var message = row.insertCell(2);
    date.innerHTML = data.date;
    user.innerHTML = data.user;
    message.innerHTML = data.message;
}
