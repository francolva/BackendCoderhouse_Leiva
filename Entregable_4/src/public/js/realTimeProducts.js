console.log("Calling realTimeProducts.js");

const realTimeList = document.getElementById("realTimeList");

function productRequest() {
	const newProduct = {
		title: document.getElementById("title").value,
		description: document.getElementById("description").value,
		code: document.getElementById("code").value,
		price: document.getElementById("price").value,
		status: document.getElementById("status").checked,
		stock: document.getElementById("stock").value,
		category: document.getElementById("category").value,
		thumbnail: document.getElementById("thumbnail").value,
	};
    return newProduct;
}

document.addEventListener("DOMContentLoaded", () => {
	const productForm = document.getElementById("productForm");
	productForm.addEventListener("submit", (event) => {
		event.preventDefault();
		console.log("Sending form");
        const newProduct = productRequest();

		socket.emit("Client: NewProduct", newProduct);

        socket.on("Server: RenderProducts", (updatedProducts) => {
            console.log('Received render')
            let updatedList = ''
            updatedProducts.forEach(product => {
                updatedList += `<li class="list-group-item">${product.title}</li>`
            });
            realTimeList.innerHTML = updatedList;
        })
	});
});