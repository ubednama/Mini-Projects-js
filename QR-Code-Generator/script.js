let qr_code = document.querySelector("#qr-code");
let code_image = document.querySelector("#code-img");
let loader = document.querySelector("#loading");

qr_code.addEventListener('click', () => {
    loader.style.display = "block";
    code_image.onload = function () {
        loader.style.display = "none";
        code_image.style.display = "block"; // Show the image when loaded
    }
    let input = document.querySelector("#input").value;
    let api = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${input}`;

    code_image.src = api;

    // Hide the image element if the input is empty
    if (input.trim() === "") {
        code_image.style.display = "none";
    }
});
