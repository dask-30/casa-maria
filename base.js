function openLightbox(src) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    lightboxImg.src = src;
    lightbox.style.display = "flex";
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}

document.getElementById("bookingForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        phone_number: document.getElementById("phone").value,
        arrival_date: document.getElementById("checkin").value,
        departure_date: document.getElementById("checkout").value,
        description: document.getElementById("message").value,
        status: "PENDING",
        deposit: false
    };
    
    fetch("http://localhost:8080/api/auth/site-login", {
        method: "POST",
        headers: {
            "X-API-KEY": "qpqdofm12r-flvopqn341m34k5j3fao345kt42"
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Nu s-a putut obține token-ul.");
        return res.json();
    })
    .then(loginData => {
        const token = loginData.token;

        return fetch("http://localhost:8080/api/reservations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
    })
    .then(res => {
        if (!res.ok) throw new Error("Nu s-a putut crea rezervarea.");
        return res.json();
    })
    .then(result => {
        console.log("Rezervare creată:", result);
        alert("Rezervarea a fost trimisă!");
    })
    .catch(error => {
        console.error("Eroare:", error);
        alert("A apărut o problemă la trimiterea rezervării.");
    });
});
