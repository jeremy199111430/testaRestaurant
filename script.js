gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────
   LOADER
───────────────────────────── */
const loader = document.querySelector('#page-loader');
loader.classList.add('active');

const debut = Date.now();

window.addEventListener('load', () => {
    const tempsEcoule  = Date.now() - debut;
    const tempsRestant = Math.max(0, 4500 - tempsEcoule);
    setTimeout(() => loader.classList.remove('active'), tempsRestant);
});

// Sécurité : disparition max à 10s
setTimeout(() => loader.classList.remove('active'), 10000);


/* ─────────────────────────────
   HERO — SLIDESHOW
───────────────────────────── */
const etats = [
    {
        grande: "preview-imgs/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.webp",
        petite: "preview-imgs/catalin-paterau-JemmivnWDhE-unsplash.webp"
    },
    {
        grande: "preview-imgs/chad-montano-eeqbbemH9-c-unsplash.webp",
        petite: "preview-imgs/federica-gioia-WsbDvk_4EwA-unsplash.webp"
    },
    {
        grande: "preview-imgs/marisol-benitez-QvkAQTNj4zk-unsplash.webp",
        petite: "preview-imgs/davey-gravy-4WPcz_5RVMk-unsplash.webp"
    },
];

let index = 0;
const bg   = document.querySelector('#hero-superpose .bg');
const mini = document.querySelector('#hero-superpose .small');

function afficheEtat(n) {
    const etat = etats[n % etats.length];

    bg.style.opacity   = 0;
    mini.style.opacity = 0;

    setTimeout(() => {
        bg.style.backgroundImage   = `url(${etat.grande})`;
        mini.style.backgroundImage = `url(${etat.petite})`;
        bg.style.opacity           = 1;
        mini.style.opacity         = 1;
        bg.classList.remove('zooming');
        void bg.offsetWidth;
        bg.classList.add('zooming');
    }, 1000);
}

afficheEtat(index);
setInterval(() => { index++; afficheEtat(index); }, 8000);


/* ─────────────────────────────
   TITRE HERO — monte au scroll
───────────────────────────── */
gsap.to(".containeur-titre", {
    yPercent: -120,
    scrollTrigger: {
        trigger: "#hero-superpose",
        start: "center 480",
        end: 1200,
        scrub: true,
    }
});


/* ─────────────────────────────
   PARALAXE — monte sur le hero
───────────────────────────── */
gsap.to(".paralaxe", {
    yPercent: -8,
    ease: "none",
    scrollTrigger: {
        trigger: "#hero-superpose",
        start: "bottom bottom",
        end: "bottom top",
        scrub: 1.5,
    }
});


/* ─────────────────────────────
   IMAGE DE FOND — parallaxe
───────────────────────────── */
const bgParallaxImg = document.querySelector(".bg-parallax img");

if (bgParallaxImg) {
    gsap.to(bgParallaxImg, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
            trigger: ".bg-parallax",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
        }
    });
}


/* ─────────────────────────────
   CARDS — apparition au scroll
───────────────────────────── */
const ancre = document.querySelector(".images-superposees");

if (ancre) {
    gsap.utils.toArray(".card").forEach((card, i) => {
        gsap.from(card, {
            yPercent: 60,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: ancre,
                start: "top 80%",
                end: "bottom center",
                toggleActions: "play reverse play reverse",
            }
        });
    });
}


/* ─────────────────────────────
   CARROUSELS VERTICAUX
───────────────────────────── */
window.addEventListener('load', () => {

  const containers = document.querySelectorAll('.carrouselleVerticale');

  containers.forEach((container) => {

    const itemsHTML = container.innerHTML;
    container.innerHTML = itemsHTML + itemsHTML + itemsHTML;

    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {

      const singleSetWidth = container.scrollWidth / 3;
      const isLeft = container.classList.contains('CarousselleGauche');
      const direction = isLeft ? -1 : 1;

      gsap.to(container, {
        x: direction * singleSetWidth * 2,
        duration: 30,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => {
            let val = parseFloat(x) % singleSetWidth;
            if (val > 0) val -= singleSetWidth;
            return val;
          })
        }
      });

    } else {

      const singleSetHeight = container.scrollHeight / 3;
      const isUp = container.classList.contains('CarousselleGauche');
      const direction = isUp ? -1 : 1;

      gsap.to(container, {
        y: direction * singleSetHeight * 2,
        duration: 200,
        ease: "none",
        repeat: -1,
        modifiers: {
          y: gsap.utils.unitize((y) => {
            let val = parseFloat(y) % singleSetHeight;
            if (val > 0) val -= singleSetHeight;
            return val;
          })
        }
      });
    }
  });
});


const cards = gsap.utils.toArray(".Card");
const section = document.querySelector(".horizontal-section");
const wrapper = document.querySelector(".wrapper");

if (window.innerWidth >= 1024) {

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".horizontal-section",
      start: "top top",
      end: "+=3000",
      scrub: true,
      pin: true,
      anticipatePin: 1,
    }
  });

  cards.forEach((card, i) => {
    if (i < cards.length - 1) {
      tl.to(card, {
        marginRight: `calc(-${40 * 0.8}vw)`,
        duration: 1,
        ease: "none",
      }, i);
    }
  });

} else {

    const totalItems = wrapper.children.length;
  
    // Crée un conteneur parent assez grand pour créer du scroll
    const container = document.createElement("div");
    container.style.height = (totalItems * 80) + "vh";    
    container.style.position = "relative";
  
    // Enveloppe la section dans ce conteneur
    section.parentNode.insertBefore(container, section);
    container.appendChild(section);
  
    // La section reste collée à l'intérieur du conteneur
    section.style.position = "sticky";
    section.style.top = "0";
    section.style.height = "100vh";
  
    window.addEventListener("scroll", () => {
      const containerRect = container.getBoundingClientRect();
  
      if (containerRect.top <= 0 && containerRect.bottom > window.innerHeight) {
        const progress = Math.abs(containerRect.top) / (container.offsetHeight - window.innerHeight);
        const maxScroll = wrapper.scrollWidth - wrapper.offsetWidth;
        wrapper.scrollLeft = progress * maxScroll;
      }
    }, { passive: true });
  }