/* Clínica Mari — Interações da landing page.
   Foco em performance e acessibilidade. Sem código morto. */
(() => {
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu Mobile ---------- */
  const nav = document.querySelector(".nav");
  const botao = document.querySelector(".nav__botao");
  const lista = document.querySelector("#menu-principal");

  if (nav && botao && lista) {
    const fechar = () => {
      nav.classList.remove("nav--aberto");
      botao.setAttribute("aria-expanded", "false");
    };

    botao.addEventListener("click", () => {
      const aberto = nav.classList.toggle("nav--aberto");
      botao.setAttribute("aria-expanded", String(aberto));
    });

    lista.addEventListener("click", (e) => {
      if (e.target.closest("a")) fechar();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("nav--aberto")) {
        fechar();
        botao.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (nav.classList.contains("nav--aberto") && !nav.contains(e.target)) fechar();
    });
  }

  /* ---------- Header Sombra ---------- */
  const topo = document.querySelector(".topo");
  if (topo) {
    const aoRolar = () => topo.classList.toggle("topo--rolado", window.scrollY > 8);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
  }

  /* ---------- Reveal on Scroll ---------- */
  const alvos = document.querySelectorAll("[data-revelar]");

  if ("IntersectionObserver" in window && !reduzir) {
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("visivel");
          obs.unobserve(e.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    alvos.forEach((a) => obs.observe(a));
  } else {
    alvos.forEach((a) => a.classList.add("visivel"));
  }

  /* ---------- Formulário para WhatsApp ---------- */
  document.querySelectorAll("form[data-whatsapp]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const dados = new FormData(form);
      const nome = (dados.get("nome") || "").trim();
      const contato = (dados.get("contato") || "").trim();
      const mensagem = (dados.get("mensagem") || "").trim();

      // Validação simples
      if (!nome || !contato) {
        const alvo = form.querySelector("input:invalid, input[name='nome'], input[name='contato']");
        if (alvo) alvo.focus();
        return;
      }

      const texto =
        `Olá! Meu nome é ${nome}.\n\n` +
        (mensagem ? `Gostaria de saber mais sobre: ${mensagem}\n\n` : "") +
        `Meu contato é: ${contato}`;

      const base = form.dataset.whatsapp.split("?")[0];
      window.open(`${base}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
    });
  });

  /* ---------- Ano Rodapé ---------- */
  const ano = document.getElementById("ano-atual");
  if (ano) ano.textContent = String(new Date().getFullYear());
})();