# David Pow · Técnico IT junior → Blue Team / SOC

**[davidpoww.github.io](https://davidpoww.github.io)** · [English version](https://davidpoww.github.io/en/) · [LinkedIn](https://www.linkedin.com/in/davidpow)

Mi CV personal en formato web. Lo he construido desde cero, línea a línea, y lo voy mejorando a medida que avanzo en ciberseguridad: cada laboratorio, certificación o proyecto nuevo termina aquí.

## Sobre mí

Técnico IT junior en Valencia, con seis meses en un entorno de producción (Active Directory, GPO, Microsoft 365, Veeam, Odoo y soporte a usuarios) y cursando el Máster en Ciberseguridad y Hacking Ético. Busco mi primer puesto en **SOC / Blue Team**, **soporte IT** o **administración de sistemas**.

## Cómo está hecha

- **Sin frameworks**: HTML, CSS y JavaScript escritos a mano.
- **Privacidad**: sin cookies, sin analítica y sin peticiones a terceros. Las tipografías se sirven desde el propio repositorio.
- **Seguridad**: Content Security Policy, enlaces externos con `noopener noreferrer`, DOM modificado solo con `textContent`, correo protegido frente a bots, CV sin metadatos y [`security.txt`](https://davidpoww.github.io/.well-known/security.txt) según RFC 9116.
- **Accesibilidad**: HTML semántico, navegación completa con teclado, textos para lectores de pantalla y respeto a `prefers-reduced-motion`.
- **Bilingüe**: español e inglés en páginas separadas, enlazadas con `hreflang`.
- **Tipografía cuidada**: sin líneas huérfanas, sangría francesa y puntuación colgante.

## Estructura

```
├── index.html          Página en español
├── en/index.html       Página en inglés
├── css/styles.css      Paleta, tipografía y componentes
├── js/main.js          Terminal, filtro de habilidades, cursor y menú activo
├── fonts/              Sora, Inter, Martian Mono y JetBrains Mono (SIL OFL)
├── assets/cv/          CV en PDF
├── .well-known/        security.txt
└── 404.html · robots.txt · sitemap.xml · favicon.svg
```

## Próximamente

- [ ] Laboratorio SOC con Wazuh: detección y documentación de casos
- [ ] Triage de alertas SIEM asistido por IA
- [ ] Certificaciones LPI Linux Essentials y Cisco CCNA
- [ ] CV en inglés

## Ejecutar en local

```bash
git clone https://github.com/Davidpoww/Davidpoww.github.io.git
cd Davidpoww.github.io
python3 -m http.server 8000 --bind 127.0.0.1
```

Después, abre `http://localhost:8000`.

## Licencia

Las tipografías se distribuyen bajo la SIL Open Font License (ver `fonts/licencias/`). El contenido y el CV son © 2026 David Pow.

---

**EN** · Personal CV website of a junior IT technician moving into Blue Team / SOC. Handmade with HTML, CSS and JavaScript: no frameworks, no cookies, no trackers. Updated as I progress. → [davidpoww.github.io/en](https://davidpoww.github.io/en/)
