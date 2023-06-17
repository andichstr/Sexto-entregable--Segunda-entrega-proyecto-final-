const socket = io();

const btnNew = document.getElementById('new')

btnNew.onclick = e => {
    e.preventDefault()
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const code = document.getElementById('code').value
    const price = document.getElementById('price').value
    const stock = document.getElementById('stock').value
    const category = document.getElementById('category').value
    const thumbnail = document.getElementById('thumbnail').value
    if (title == '' || description == '' || code == '' || price == '' || stock == '' || category == '') {
        alert('Se requieren todos los campos menos el ultimo')
    } else {
        socket.emit('add_product', {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnail                    
            })
        document.getElementById('title').value = ''
        document.getElementById('description').value = ''
        document.getElementById('code').value = ''
        document.getElementById('price').value = ''
        document.getElementById('stock').value = ''
        document.getElementById('category').value = ''
        document.getElementById('thumbnail').value = ''
    }
}

socket.on("new_item", data => {
    addDataToItems(data);
})

function addDataToItems(data) {
    const table = document.getElementById('tabla1')
    var row = table.insertRow(-1);
    var id = row.insertCell(0);
    var title = row.insertCell(1);
    var description = row.insertCell(2);
    var code = row.insertCell(3);
    var price = row.insertCell(4);
    var status = row.insertCell(5);
    var stock = row.insertCell(6);
    var category = row.insertCell(7);
    var thumbnail = row.insertCell(8);
    id.innerHTML = data.id;
    title.innerHTML = data.title;
    description.innerHTML = data.description;
    code.innerHTML = data.code;
    price.innerHTML = data.price;
    status.innerHTML = data.status;
    stock.innerHTML = data.stock;
    category.innerHTML = data.category;
    thumbnail.innerHTML = data.thumbnail;
}

