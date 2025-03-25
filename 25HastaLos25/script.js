window.addEventListener("load", function() {
    const loader = document.getElementById("loader");
    loader.style.opacity = "0"; // Oculta el loader con una transición
    setTimeout(() => {
        loader.classList.add("hidden");
        const content = document.getElementById("content");
        content.classList.remove("hidden");
        content.style.opacity = "1";
        content.style.pointerEvents = "auto";
    }, 2000);
});

document.addEventListener("DOMContentLoaded", function() {
    const calendar = document.getElementById("calendar");
    const overlay = document.getElementById("overlay");
    const giftText = document.getElementById("gift-text");
    const giftContent = document.getElementById("gift-content");
    const closedMessage = document.getElementById("closed-message");
    const closeButton = document.getElementById("close-overlay");

    let daysOrder = JSON.parse(localStorage.getItem("daysOrder"));
    const openedDays = JSON.parse(localStorage.getItem("openedDays")) || [];

    var points = localStorage.getItem("points");

    const productId = localStorage.getItem("buyProduct");

    if (productId) {
        const productElement = document.getElementById(productId);
    
        if (productElement) {
            const productImage = productElement.querySelector("img");
    
            if (productImage) {
                productImage.style.filter = "brightness(100%)";
            }
        }
    }
    

    if (points != null) {
        points = parseInt(points, 10);
        document.getElementById("points").textContent = points;
        document.getElementById("points-count").textContent = points;
    } else {
        points = 0;
        document.getElementById("points").textContent = points;
        document.getElementById("points-count").textContent = points;
    }

    if (!daysOrder) {
        daysOrder = Array.from({ length: 26 }, (_, i) => i + 1);
        shuffleArray(daysOrder);
        localStorage.setItem("daysOrder", JSON.stringify(daysOrder));
    }

    const dayHtmls = [
       `<div>
            <p>¡Bienvenida a tu Calendario de Adviento!</p>
            <p>
                Durante los próximos <strong>25 días</strong>, cada día te espera una <strong>sorpresa especial</strong>. <br>
                Podrás <strong>descubrir regalos únicos</strong>, elegir algunos por ti misma y disfrutar de cada detalle pensado con cariño. <br>
                ¡Espero que lo disfrutes tanto como yo disfruté preparándolo para ti!
            </p>
        </div>`,
        `<div>
            <img src='/resources/img/ticket.png'>
            <p>Vale por un masaje!</p>
        </div>`,
        `<div>
            <p>Eres mi persona favorita en este y todos los universos posibles. 🤍</p>
            <p>Una frase motivadora</p>
        </div>`,
        `<div>
            <img src='/resources/img/snack.png'>
            <p>Un snack sorpresa!</p>
        </div>`,
        `<div>
            <img src='/resources/img/points.png'>
            <p data-points="100">100 Puntos</p>
        </div>`,
        `<div>
            <img src='/resources/img/mask.png'>
            <p>Sesion de mascarillas faciales!</p>
        </div>`,
        `<div>
            <p>Hoy es tu lienzo en blanco para tu nueva semana, pinta en él lo que te haga feliz. 🤍</p>
            <p>Una frase motivadora</p>
        </div>`,
        `<div>
            <img src='/resources/img/ticket.png'>
            <p>Vale por una cena romántica casera!</p>
        </div>`,
        `<div>
            <img src='/resources/img/points.png'>
            <p data-points="100">100 Puntos</p>
        </div>`,
        `<div>
            <img src='/resources/img/snack.png'>
            <p>Un snack sorpresa!</p>
        </div>`,
        `<div>
            <img src='/resources/img/ticket.png'>
            <p>Vale por lo que quieras! Pídelo y lo haré realidad.</p>
        </div>`,
        `<div>
            <img src='/resources/img/points.png'>
            <p data-points="100">100 Puntos</p>
        </div>`,
        `<div>
            <img src='/resources/img/cupcake.png'>
            <p>Día de reposteria!</p>
        </div>`,
        `<div>
            <p>Cada día es una nueva oportunidad para acercarte a tus sueños. 🤍</p>
            <p>Una frase motivadora</p>
        </div>`,
        `<div>
            <img src='/resources/img/points.png'>
            <p data-points="100">100 Puntos</p>
        </div>`,
        `<div>
            <img src='/resources/img/snack.png'>
            <p>Un snack sorpresa!</p>
        </div>`,
        `<div>
            <img src='/resources/img/ticket.png'>
            <p>Vale por un picnic!</p>
        </div>`,
        `<div>
            <img src='/resources/img/points.png'>
            <p data-points="100">100 Puntos</p>
        </div>`,
        `<div>
            <p>Prepárate para una experiencia que despertará todos tus sentidos. 🤍</p>
            <p>Un lugar al que ir</p>
        </div>`,
        `<div>
            <img src='/resources/img/points.png'>
            <p data-points="100">100 Puntos</p>
        </div>`,
        `<div>
            <p>Que hoy sea el comienzo de una semana llena de oportunidades! 🤍</p>
            <p>Una frase motivadora</p>
        </div>`,
        `<div>
            <img src='/resources/img/points.png'>
            <p data-points="100">100 Puntos</p>
        </div>`,
        `<div>
            <img src='/resources/img/snack.png'>
            <p>Un snack sorpresa!</p>
        </div>`,
        `<div>
            <img src='/resources/img/points.png'>
            <p data-points="100">100 Puntos</p>
        </div>`,
        `<div>
            <p>¡Falta un día! Para tu gran día!</p>
            <p>
                Espero que cada pequeño detalle que he preparado con cariño haya llenado tu corazón de alegría y emoción. 
            </p>
        </div>`,
        `<div>
            <p>¡Felicidades! Disfruta tu día, te quiero. 🤍</p>
            <img src='/resources/img/gift.png'>
        </div>`
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    const today = new Date();
    today.setDate(today.getDate());
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();

    const unlockAll = currentMonth > 3; 

    daysOrder.forEach(i => {
        let day = document.createElement("div");
        day.classList.add("day");
        day.textContent = i;

        if (i === currentDay && !openedDays.includes(i)) {
            day.classList.add("today");
        }
        
        if (openedDays.includes(i)) {
            day.style.backgroundColor = "#222";
            day.style.color = "white";
            day.classList.remove("today");
        }
        
        if (!unlockAll && i > currentDay) {
            day.classList.add("locked");
            day.addEventListener("click", function() {
                giftText.textContent = `Día ${i} bloqueado!`;
                giftContent.innerHTML = "No intentes hacer trampas, tramposilla :(";
                overlay.style.display = "flex";
            });
        } else {
            day.addEventListener("click", function() {
                if (!day.classList.contains("locked")) {
                    giftText.textContent = `Regalo del día ${i}`;
                    giftContent.innerHTML = dayHtmls[i - 1]; 
                    overlay.style.display = "flex";
                    day.style.backgroundColor = "#222";
                    day.style.color = "white";

                    if (!openedDays.includes(i)) {
                        openedDays.push(i);
                        localStorage.setItem("openedDays", JSON.stringify(openedDays));
                        day.classList.remove("today");

                        const pointsElement = giftContent.querySelector("[data-points]");
                        if (pointsElement) {
                            const pointsToAdd = parseInt(pointsElement.getAttribute("data-points"), 10);
                            points += pointsToAdd;
                            document.getElementById("points").textContent = points.toString();
                            document.getElementById("points-count").textContent = points.toString();                    
                            localStorage.setItem("points", points);
                        }
                    }
                }
            });
        }

        calendar.appendChild(day);
    });

    closeButton.addEventListener("click", function() {
        overlay.style.display = "none";
    });

    document.getElementById('shop-button').addEventListener('click', function() {
        const shopPanel = document.getElementById('shop');
        shopPanel.style.display = 'flex'; 
    });
    
    document.getElementById('close-shop-button').addEventListener('click', function() {
        const shopPanel = document.getElementById('shop');
        shopPanel.style.display = 'none'; 
    });

    document.querySelectorAll('.products div').forEach(product => {
        product.addEventListener('click', function() {
            if (points >= 800) {
                points = 0;
                document.getElementById("points").textContent = points.toString();
                document.getElementById("points-count").textContent = points.toString();   
                localStorage.setItem("points", points);
                localStorage.setItem("buyProduct", product.id);
                product.querySelector("img").style.filter = "brightness(100%)";
            } 
            else {
                const alertBox = document.getElementById('shop-alert');
                alertBox.style.display = 'flex';
            }
        });
    });
    
    document.getElementById('close-alert').addEventListener('click', function() {
        document.getElementById('shop-alert').style.display = 'none'; // Cierra la alerta
    });
});

function closeOverlay() {
    document.getElementById("overlay").style.display = "none";
}
