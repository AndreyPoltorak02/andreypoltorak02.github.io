const elements = document.querySelectorAll('.animate');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, {
    threshold: 0.2
});

elements.forEach(el => observer.observe(el));

const weddingDate = new Date("2026-07-14T00:00:00");

function getDeclension(number, one, few, many) {
    number = Math.abs(number) % 100;
    const n1 = number % 10;

    if (number > 10 && number < 20) return many;
    if (n1 > 1 && n1 < 5) return few;
    if (n1 === 1) return one;
    return many;
}

function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
        document.querySelector(".countdown").innerHTML =
            "<p>Свадьба уже наступила!</p>";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.querySelector("#days span").textContent = days;
    document.querySelector("#hours span").textContent =
        hours.toString().padStart(2, "0");
    document.querySelector("#minutes span").textContent =
        minutes.toString().padStart(2, "0");
    document.querySelector("#seconds span").textContent =
        seconds.toString().padStart(2, "0");

    document.getElementById("days-label").textContent =
        getDeclension(days, "ДЕНЬ", "ДНЯ", "ДНЕЙ");

    document.getElementById("hours-label").textContent =
        getDeclension(hours, "ЧАС", "ЧАСА", "ЧАСОВ");

    document.getElementById("minutes-label").textContent =
        getDeclension(minutes, "МИНУТА", "МИНУТЫ", "МИНУТ");

    document.getElementById("seconds-label").textContent =
        getDeclension(seconds, "СЕКУНДА", "СЕКУНДЫ", "СЕКУНД");
}

setInterval(updateCountdown, 1000);
updateCountdown();

const track = document.querySelector(".wishes-track");
let slides = document.querySelectorAll(".wish");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const dotsContainer = document.querySelector(".wishes-dots");

let currentIndex = 0;

const firstClone = slides[0].cloneNode(true);
track.appendChild(firstClone);

slides = document.querySelectorAll(".wish");

slides.forEach((slide, index) => {
    if (index === slides.length - 1) return;

    const dot = document.createElement("span");
    dot.textContent = index + 1;

    if (index === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
        currentIndex = index;
        updateSlider();
        updateDots();
    });

    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".wishes-dots span");

function updateSlider() {
    track.style.transition = "transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)";
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
}

function updateDots() {
    dots.forEach(dot => dot.classList.remove("active"));

    if (currentIndex < dots.length) {
        dots[currentIndex].classList.add("active");
    } else {
        dots[0].classList.add("active");
    }
}

nextBtn.addEventListener("click", () => {
    if (currentIndex >= slides.length - 1) return;
    currentIndex++;
    updateSlider();
});

prevBtn.addEventListener("click", () => {
    if (currentIndex <= 0) return;
    currentIndex--;
    updateSlider();
});

track.addEventListener("transitionend", () => {
    if (currentIndex === slides.length - 1) {
        track.style.transition = "none";
        currentIndex = 0;
        track.style.transform = `translateX(0%)`;
    }
});

document.getElementById('sendBtn').addEventListener('click', async () => {

    const name = document.querySelector('input[name="name"]')?.value;
    const attendance = document.querySelector('input[name="attendance"]:checked')?.value;
    const guestName = document.querySelector('input[name="guestName"]')?.value;

    const foodYou = [...document.querySelectorAll('input[name="food-i"]:checked')]
        .map(el => el.parentElement.textContent.trim())
        .join(', ');

    const foodGuest = [...document.querySelectorAll('input[name="food-companion"]:checked')]
        .map(el => el.parentElement.textContent.trim())
        .join(', ');
    const alcohol = [...document.querySelectorAll('input[name="alcohol"]:checked')]
        .map(el => el.parentElement.textContent.trim())
        .join(', ');

    const text = `
💌 Новая анкета

👤 Имя: ${name}
👥 Спутник: ${guestName}
📍 Присутствие: ${attendance}

🍽 Еда для гостя: ${foodYou}
🍽 Еда для спутника: ${foodGuest}

🥂 Алкоголь: ${alcohol}
`;

    await fetch(`https://api.telegram.org/bot8576353993:AAH-C_Q1oeJRco3hOJgaiyn3Hvl3NBLSoR4/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat_id: "744166814",
            text: text
        })
    });

    alert("Ответ отправлен 💌");
});