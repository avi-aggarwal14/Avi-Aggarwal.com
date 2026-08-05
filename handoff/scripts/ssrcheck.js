const http = require("http");
const https = require("https");

const target = process.argv[2] || "http://localhost:3000/";
const mod = target.startsWith("https") ? https : http;

mod.get(target, (res) => {
  let d = "";
  res.on("data", (c) => (d += c));
  res.on("end", () => {
    const zeros = (d.match(/opacity:\s*0[^.\d]/g) || []).length;
    const heroStart = d.indexOf('id="top"');
    const heroEnd = d.indexOf('id="about"');
    const hero = d.slice(heroStart, heroEnd > 0 ? heroEnd : heroStart + 40000);
    const heroZeros = (hero.match(/opacity:\s*0[^.\d]/g) || []).length;
    console.log(
      JSON.stringify(
        {
          target,
          opacityZeroWholePage: zeros,
          opacityZeroInHero: heroZeros,
          heroHasName: hero.includes("Aggarwal"),
          heroHasIntro: hero.includes("placeholder copy sitting"),
          heroHasFirstRole: hero.includes("Placeholder One"),
          heroHasCssEntrance: hero.includes("hero-char") && hero.includes("hero-in"),
        },
        null,
        1,
      ),
    );
  });
}).on("error", (e) => console.error("ERR", e.message));
