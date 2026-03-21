console.log("JS loaded START");

async function wakeServer(retry = 0) {
    try {
        console.log("wakeServer retry=" + retry);
        const res = await fetch("https://springbootserver-ra5y.onrender.com/api/auth/wake", {
            method: "POST",
            credentials: "omit"
        });
        if (!res.ok) throw new Error("Server nu e ready, status " + res.status);
        const data = await res.json();
        console.log("Server trezit:", data);
        return true;
    } catch (e) {
        console.log("Nu s-a putut trezi serverul:", e.message);
        if (retry < 7) {
            console.log("Retry in 10 sec...");
            await new Promise(r => setTimeout(r, 10000));
            return wakeServer(retry + 1);
        }
        return false;
    }
}

async function loadDates() {
    const loading = document.getElementById("loading");
    const form = document.getElementById("bookingForm");

    if (loading) loading.style.display = "flex";
    if (form) form.style.display = "none";

    try {
        console.log("S-a intrat in loadDates");
        const res = await fetch("https://springbootserver-ra5y.onrender.com/api/reservations/availability");
        if (!res.ok) throw new Error("Server not ready, status " + res.status);

        const ranges = await res.json();
        const disabledRanges = ranges.map(r => ({ from: r.arrivalDate, to: r.departureDate }));

        initCalendar(disabledRanges);

        if (loading) loading.style.display = "none";
        if (form) form.style.display = "flex";

    } catch (e) {
        console.log("Server încă nu e ready:", e);
        setTimeout(loadDates, 5000);
    }
}

function initCalendar(disabledRanges) {
    const checkoutInput = document.querySelector("#checkout");
    const checkinInput = document.querySelector("#checkin");
    if (!checkoutInput || !checkinInput) return;

    const checkout = flatpickr(checkoutInput, {
        dateFormat: "Y-m-d",
        disable: disabledRanges
    });

    flatpickr(checkinInput, {
        dateFormat: "Y-m-d",
        minDate: "today",
        disable: disabledRanges,
        onChange: function (selectedDates, dateStr) {
            checkout.set("minDate", dateStr);
        }
    });
}

function openLightbox(src) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.style.display = "flex";
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    lightbox.style.display = "none";
}

function attachFormSubmit() {
    const bookingForm = document.getElementById("bookingForm");
    if (!bookingForm) return;

    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nameInput = document.getElementById("name");
        const phoneInput = document.getElementById("phone");
        const checkinInput = document.getElementById("checkin");
        const checkoutInput = document.getElementById("checkout");
        const messageInput = document.getElementById("message");

        if (!nameInput || !phoneInput || !checkinInput || !checkoutInput || !messageInput) {
            alert("Formular incomplet sau elemente lipsă.");
            return;
        }

        const data = {
            name: nameInput.value,
            phone_number: phoneInput.value,
            arrival_date: checkinInput.value,
            departure_date: checkoutInput.value,
            description: messageInput.value,
            status: "PENDING",
            deposit: false
        };

        fetch("https://springbootserver-ra5y.onrender.com/api/auth/site-login", {
            method: "POST",
            headers: { "X-API-KEY": "qpqdofm12r-flvopqn341m34k5j3fao345kt42" }
        })
        .then(res => {
            if (!res.ok) throw new Error("Nu s-a putut obține token-ul.");
            return res.json();
        })
        .then(loginData => {
            const token = loginData.token;
            return fetch("https://springbootserver-ra5y.onrender.com/api/reservations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "X-Source": "browser"
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
            loadDates();
        })
        .catch(error => {
            console.error("Eroare:", error);
            alert("A apărut o problemă la trimiterea rezervării.");
        });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM loaded");

    if (!sessionStorage.getItem("serverAwake")) {
        const awake = await wakeServer();
        if (awake) sessionStorage.setItem("serverAwake", "true");
    }

    loadDates();

    attachFormSubmit();
});
