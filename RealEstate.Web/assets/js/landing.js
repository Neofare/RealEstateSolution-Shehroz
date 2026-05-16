document.addEventListener("mousemove", (e) => {
    const page = document.querySelector(".landing-page");

    if (!page) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    page.style.setProperty("--mouse-x", `${x}px`);
    page.style.setProperty("--mouse-y", `${y}px`);

    const visual = document.querySelector(".main-property-card");

    if (visual) {
        visual.style.transform = `rotate(2deg) translate(${x * 0.25}px, ${y * 0.25}px)`;
    }
});