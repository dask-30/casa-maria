async function wakeServer(retry = 0) {
    try {
        const res = await fetch("https://springbootserver-ra5y.onrender.com/api/auth/wake", { method:"POST" });
        if(!res.ok) throw new Error("Server nu e ready");
        const data = await res.json();
        console.log("Server trezit:", data);
        return true; 
    } catch(e) {
        console.log("Nu s-a putut trezi serverul:", e.message);
        if(retry < 7) { 
            console.log("Retry in 10 sec...");
            await new Promise(r => setTimeout(r, 10000));
            return wakeServer(retry + 1);
        }
        return false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
   
    if(!sessionStorage.getItem("serverAwake")) {
        wakeServer();
        sessionStorage.setItem("serverAwake", "true");
    }
});
async function loadDates() {
    const loading = document.getElementById("loading");
    const form = document.getElementById("bookingForm");

    try {
        const res = await fetch("https://springbootserver-ra5y.onrender.com/api/reservations/availability");

        if(!res.ok) throw new Error("Server not ready");

        const ranges = await res.json();

        const disabledRanges = ranges.map(r => ({
            from: r.arrivalDate,
            to: r.departureDate
        }));

        initCalendar(disabledRanges);

        if (loading && form) {
            loading.style.display = "none";
            form.style.display = "flex";
    }

    } catch (e) {
        console.log("Server încă nu e ready:", e);

        if (loading && form) {
            loading.style.display = "flex";
            form.style.display = "none";
        setTimeout(loadDates, 5000);
    }
}

function initCalendar(disabledRanges) {

    const checkout = flatpickr("#checkout", {
        dateFormat: "Y-m-d",
        disable: disabledRanges
    });

    flatpickr("#checkin", {
    dateFormat: "Y-m-d",
    minDate: "today",
    disable: disabledRanges,
    onChange: function(selectedDates, dateStr) {
        checkout.set("minDate", dateStr);
    }
});
}
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#bookingForm");
    if(form){
        loadDates(); 
    }
});

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
    
    fetch("https://springbootserver-ra5y.onrender.com/api/auth/site-login", {
        method: "POST",
        headers: {
            "X-API-KEY": "qpqdofm12r-flvopqn341m34k5j3fao345kt42",
        }
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
                "X-Source":"browser"
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
