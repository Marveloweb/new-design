// Shared behavior for all five pages. Each feature checks that its markup is on the page.
(function () {
  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => [...(root || document).querySelectorAll(selector)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
  const { TRADES, render } = window.MarveloSample;
  const KEYS = Object.keys(TRADES);

  // Where form requests go: the MarveloWeb CRM (Supabase). The publishable key is meant to be
  // public; it can only call the submit_website_lead function, which checks every field.
  const CRM = { url: "https://mdnymscknpjnpndmmhhg.supabase.co", key: "sb_publishable_qwsWkh154WNn5oWPKsho7A_QG_5I02o" };
  const CONTACT_EMAIL = "info@marveloweb.com";

  // ----- Calls to action stay on the page when it has its own form -----
  const form = $("#ask");
  function goToForm() {
    $("#start").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }
  if (form) {
    $$('a[href^="contact.html"][href$="#start"]').forEach((a) => {
      const plan = new URL(a.href).searchParams.get("plan");
      a.addEventListener("click", (e) => {
        e.preventDefault();
        if (plan) $("#ask-plan").value = plan;
        goToForm();
      });
    });
  }

  // ----- Form: required fields, with the message beside the field -----
  if (form) {
    const params = new URLSearchParams(location.search);
    const plan = params.get("plan");
    if (plan) $("#ask-plan").value = plan;
    if (TRADES[params.get("trade")]) $("#ask-trade").value = TRADES[params.get("trade")].label;

    const website = $("#ask-website");
    if (document.body.dataset.page === "redesign") {
      website.required = true;
      $("#ask-website-label").innerHTML = 'Your website <i class="req" aria-hidden="true">*</i>';
    }

    // Keep only the address itself: "https://www.csme.com/about" becomes "csme.com"
    const cleanDomain = (value) => value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split(/[/?#]/)[0];
    const isDomain = (value) => /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/.test(value);
    const fieldOk = (field) => {
      const value = field.value.trim();
      if (!value) return !field.required;
      if (field === website) return isDomain(value);
      if (field.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      if (field.type === "tel") return value.replace(/\D/g, "").length >= 10;
      return true;
    };
    const check = (field) => {
      const ok = fieldOk(field);
      const label = field.closest("label");
      let message = $(".field-err", label);
      if (ok) {
        field.removeAttribute("aria-invalid");
        field.removeAttribute("aria-describedby");
        if (message) message.remove();
      } else {
        field.setAttribute("aria-invalid", "true");
        if (!message) {
          message = document.createElement("small");
          message.className = "field-err";
          message.id = field.name + "-err";
          label.append(message);
        }
        message.textContent = field.dataset.err;
        field.setAttribute("aria-describedby", message.id);
      }
      return ok;
    };
    const fields = $$("input:not([type=hidden]):not([name=company_url])", form);
    website.addEventListener("blur", () => { website.value = cleanDomain(website.value); });
    fields.forEach((field) => {
      field.addEventListener("input", () => { if (field.hasAttribute("aria-invalid")) check(field); });
      field.addEventListener("blur", () => { if (field.value.trim() || field.hasAttribute("aria-invalid")) check(field); });
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      website.value = cleanDomain(website.value);
      const bad = fields.filter((field) => !check(field));
      if (bad.length) {
        $("#ask-status").textContent = "";
        bad[0].focus();
        return;
      }
      // Sends the request straight to the MarveloWeb CRM (new lead + email to the team)
      const value = (name) => form.elements[name].value.trim();
      const status = $("#ask-status");
      const button = $("button[type=submit]", form);
      const keys = ["business", "name", "trade", "town", "email", "phone", "website", "plan"];
      const data = Object.fromEntries(keys.map((k) => [k, value(k)]));
      data.page = document.body.dataset.page || "";
      data.company_url = form.elements.company_url ? form.elements.company_url.value : "";

      // If the CRM can't be reached, offer the email app as a backup
      const mailtoHref = () => {
        const body = [["Business", "business"], ["Name", "name"], ["Trade", "trade"], ["Town", "town"],
          ["Email", "email"], ["Phone", "phone"], ["Website", "website"], ["Plan", "plan"]]
          .filter(([, k]) => data[k]).map(([label, k]) => `${label}: ${data[k]}`).join("\n");
        return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Free website preview: ${data.business}`)}&body=${encodeURIComponent(body)}`;
      };

      button.disabled = true;
      status.textContent = "Sending your request…";
      fetch(`${CRM.url}/rest/v1/rpc/submit_website_lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: CRM.key },
        body: JSON.stringify({ p: data }),
      })
        .then(async (res) => {
          if (res.ok) {
            form.reset();
            status.innerHTML = `<strong>Thanks${data.name ? ", " + data.name.split(" ")[0].replace(/[<>&"]/g, "") : ""}! We've got your request.</strong> We'll send your free preview within 5 business days.`;
            return;
          }
          let code = "";
          try { code = (await res.json()).message || ""; } catch (_) {}
          if (code === "rate_limited") {
            status.textContent = "We already have your request and will be in touch soon.";
          } else {
            throw new Error(code || res.status);
          }
        })
        .catch(() => {
          status.innerHTML = `Sorry, that didn't go through. <a href="${mailtoHref()}">Email your request to us instead</a> and we'll take it from there.`;
        })
        .finally(() => { button.disabled = false; });
    });
  }

  // ----- Plans: choose a new website or an existing one -----
  const planType = $("#plan-type");
  if (planType) {
    const params = new URLSearchParams(location.search);
    const asked = params.get("type");
    const showPlans = (type) => {
      $$("[data-plan-set]").forEach((set) => { set.hidden = set.dataset.planSet !== type; });
      $$("[data-plan-only]").forEach((part) => { part.hidden = part.dataset.planOnly !== type; });
    };
    planType.value = asked === "redesign" || asked === "new" ? asked : document.body.dataset.page === "redesign" ? "redesign" : "new";
    showPlans(planType.value);
    planType.addEventListener("change", () => {
      showPlans(planType.value);
      const url = new URL(location.href);
      url.searchParams.set("type", planType.value);
      history.replaceState(null, "", url);
    });
  }

  // Social profiles aren't live yet, so these buttons stay on the page
  $$("[data-social]").forEach((link) => link.addEventListener("click", (e) => e.preventDefault()));

  // ----- Close the phone menu after choosing -----
  const menu = $(".menu");
  document.addEventListener("click", (e) => { if (menu.open && !menu.contains(e.target)) menu.open = false; });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.open) { menu.open = false; $("summary", menu).focus(); } });
  $$("a", menu).forEach((link) => link.addEventListener("click", () => { menu.open = false; }));

  // ----- Hide the phone call-to-action once the form is in view -----
  const sticky = $(".sticky-cta");
  if (sticky && form) {
    // Only one main button on screen: hide this while the hero button or the form is visible
    const inView = new Set();
    const watch = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) inView.add(entry.target); else inView.delete(entry.target); });
      sticky.classList.toggle("is-hidden", inView.size > 0);
    }, { threshold: 0.15 });
    $$("#hero-run, .page-hero .btn, #start, .foot-cta .btn").forEach((target) => watch.observe(target));
  }

  // ----- Pointer tilt with a moving highlight -----
  if (canHover && !reduced) {
    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const box = card.getBoundingClientRect();
        const x = (e.clientX - box.left) / box.width;
        const y = (e.clientY - box.top) / box.height;
        card.style.setProperty("--tx", ((0.5 - y) * 9).toFixed(2) + "deg");
        card.style.setProperty("--ty", ((x - 0.5) * 11).toFixed(2) + "deg");
        card.style.setProperty("--gx", (x * 100).toFixed(0) + "%");
        card.style.setProperty("--gy", (y * 100).toFixed(0) + "%");
        card.classList.add("is-tilting");
      });
      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--tx");
        card.style.removeProperty("--ty");
        card.classList.remove("is-tilting");
      });
    });
  }

  // ----- Fit a fixed-width sample inside its frame -----
  function fit(host, width) {
    const scale = host.parentElement.clientWidth / width;
    host.style.width = width + "px";
    host.style.transform = `scale(${scale})`;
  }

  // ----- Home: 3D ring of real sample sites -----
  const stage = $("#ring-stage");
  if (stage) {
    const ring = $("#ring");
    const nameInput = $("#try-name");
    const townInput = $("#try-town");
    const tradeInput = $("#try-trade");
    const phoneSite = $("#phone-site");
    const STEP = 360 / KEYS.length;
    let cur = 0;      // keeps counting past the trade list, so the ring always spins the short way
    let touched = false;
    let hovering = false;
    let radius = 0;

    const index = () => ((cur % KEYS.length) + KEYS.length) % KEYS.length;
    const values = () => ({ name: nameInput.value, town: townInput.value });

    const panels = KEYS.map((key, i) => {
      const panel = document.createElement("a");
      panel.className = "panel";
      panel.href = `sample.html?trade=${key}`;
      panel.setAttribute("aria-label", `Open the ${TRADES[key].label.toLowerCase()} sample`);
      panel.innerHTML = `<div class="panel-bar"><i></i><i></i><i></i><span></span></div><div class="panel-view"><div class="panel-host"></div></div>`;
      ring.append(panel);
      return panel;
    });

    function paint(i) {
      const key = KEYS[i];
      const v = values();
      const host = $(".panel-host", panels[i]);
      render(host, { trade: key, name: v.name, town: v.town, lite: true });
      const slug = (v.name.trim() || TRADES[key].biz).toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 26);
      $(".panel-bar span", panels[i]).textContent = slug + ".com";
      const q = new URLSearchParams({ trade: key });
      if (v.name.trim()) q.set("name", v.name.trim());
      if (v.town.trim()) q.set("town", v.town.trim());
      panels[i].href = "sample.html?" + q;
    }
    function paintPhone() {
      const v = values();
      render(phoneSite, { trade: KEYS[index()], name: v.name, town: v.town, lite: true });
      phoneSite.style.width = "390px";
      drawFly();
    }
    function place() {
      layoutFly();
      const panelWidth = Math.min(600, stage.clientWidth * 0.8);
      radius = panelWidth * 0.98;
      stage.style.setProperty("--pw", panelWidth + "px");
      panels.forEach((panel, i) => {
        panel.style.transform = `rotateY(${i * STEP}deg) translateZ(${radius}px)`;
        $(".panel-host", panel).style.transform = `scale(${panelWidth / 1280})`;
      });
      spin();
      paintPhone();
    }
    function spin() {
      ring.style.transform = `translateZ(${-radius}px) rotateY(${-cur * STEP}deg)`;
      const at = index();
      panels.forEach((panel, i) => {
        const away = Math.min((i - at + KEYS.length) % KEYS.length, (at - i + KEYS.length) % KEYS.length);
        panel.style.opacity = away === 0 ? 1 : 0;
        panel.style.pointerEvents = away === 0 ? "auto" : "none";
        panel.tabIndex = away === 0 ? 0 : -1;
      });
      paint(at);
      paintPhone();
    }
    function goTo(i) {
      let delta = i - index();
      if (delta > KEYS.length / 2) delta -= KEYS.length;
      if (delta < -KEYS.length / 2) delta += KEYS.length;
      cur += delta;
      spin();
    }

    // Scrolling the hero: a cursor moves to the phone and taps it. The phone grows to fill the screen,
    // its page scrolls, then a call comes in, and the dark screen runs on into the next section.
    const run = $("#hero-run");
    const hero = $("#top");
    const phoneEl = $("#hero-phone");
    const phoneScreen = $(".phone-screen", phoneEl);
    const slot = $("#phone-slot");
    const cursor = $("#hero-cursor");
    const backdrop = $("#fly-backdrop");
    const notes = $("#fly-notes");
    const points = $$("#fly-points li");
    const call = $("#phone-call");
    const head = $(".head");
    const under = [$(".hero-copy", hero), $(".ring-wrap", hero)];
    const POINT_AT = [0.6, 0.66, 0.72, 0.86];
    const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
    const smooth = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const mix = (a, b, t) => a + (b - a) * t;
    let geo = null;
    let flyP = 0;

    function layoutFly() {
      const wide = innerWidth > 980;
      const vh = innerHeight;
      const headH = head.offsetHeight;
      const visH = vh - headH;
      const captionH = wide ? 0 : 108;
      const heroW = hero.clientWidth;
      const tH = wide ? visH - 36 : Math.min(visH - captionH - 14, ((heroW - 72) * 18.5) / 9);
      const tW = (tH * 9) / 18.5;
      phoneEl.style.width = tW + "px";
      phoneEl.style.height = tH + "px";
      phoneEl.style.fontSize = tW / 24 + "px";
      notes.style.setProperty("--tw", tW + "px");

      const heroH = hero.offsetHeight;
      const pinTop = reduced ? 0 : Math.min(headH, vh - heroH);
      const extra = vh * (wide ? 2.4 : 2);
      if (!reduced) {
        hero.style.top = pinTop + "px";
        run.style.height = heroH + extra + "px";
      }
      const visTop = headH - pinTop;
      notes.style.top = visTop + "px";
      notes.style.height = (wide ? visH : captionH) + "px";

      const heroBox = hero.getBoundingClientRect();
      const home = slot.getBoundingClientRect();
      const btn = $("#try-go").getBoundingClientRect();
      const homeX = home.left - heroBox.left;
      const homeY = home.top - heroBox.top;
      geo = {
        pinTop, extra,
        homeX, homeY,
        homeScale: home.width / tW,
        toX: (heroW - tW) / 2,
        toY: visTop + (wide ? (visH - tH) / 2 : captionH),
        startX: btn.left - heroBox.left + btn.width * 0.7,
        startY: btn.top - heroBox.top + btn.height * 0.5,
        endX: homeX + home.width * 0.5,
        endY: homeY + home.height * 0.45,
      };
      if (reduced) flyP = 0;
    }

    function drawFly() {
      if (!geo) return;
      const p = flyP;
      const fly = smooth(seg(p, 0.36, 0.6));
      const scale = mix(geo.homeScale, 1, fly);
      phoneEl.style.transform = `translate(${mix(geo.homeX, geo.toX, fly)}px, ${mix(geo.homeY, geo.toY, fly)}px) scale(${scale})`;

      const tap = seg(p, 0.3, 0.36);
      phoneEl.style.setProperty("--ring", (Math.sin(Math.PI * tap) * 10) / scale + "px");
      const a = smooth(seg(p, 0.05, 0.3));
      const ctrlX = (geo.startX + geo.endX) / 2;
      const ctrlY = Math.min(geo.startY, geo.endY) - 70;
      const x = (1 - a) * (1 - a) * geo.startX + 2 * (1 - a) * a * ctrlX + a * a * geo.endX;
      const y = (1 - a) * (1 - a) * geo.startY + 2 * (1 - a) * a * ctrlY + a * a * geo.endY;
      cursor.style.opacity = seg(p, 0.04, 0.08) * (1 - seg(p, 0.4, 0.46));
      cursor.style.transform = `translate(${x}px, ${y}px) scale(${1 - 0.22 * Math.sin(Math.PI * tap)})`;

      backdrop.style.opacity = seg(p, 0.38, 0.56);
      notes.style.opacity = seg(p, 0.56, 0.64);
      under.forEach((el) => { el.inert = p > 0.5; });
      let cur = -1;
      points.forEach((li, i) => { if (p >= POINT_AT[i]) cur = i; });
      points.forEach((li, i) => {
        li.classList.toggle("is-on", i <= cur);
        li.classList.toggle("is-cur", i === cur);
      });

      const siteScale = phoneScreen.clientWidth / 390;
      const room = Math.max(0, phoneSite.offsetHeight * siteScale - phoneScreen.clientHeight);
      phoneSite.style.transform = `translateY(${-seg(p, 0.75, 0.84) * room}px) scale(${siteScale})`;
      call.style.transform = `translateY(${(1 - smooth(seg(p, 0.85, 0.91))) * 101}%)`;
    }

    KEYS.forEach((_, i) => paint(i));
    place();
    let lastW = innerWidth;
    let lastH = innerHeight;
    addEventListener("resize", () => {
      // Phone address bars change the height a little while scrolling: ignore that
      if (innerWidth === lastW && Math.abs(innerHeight - lastH) < 120) return;
      lastW = innerWidth;
      lastH = innerHeight;
      place();
    });
    if (!reduced) {
      let queued = false;
      const onScroll = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          flyP = clamp((geo.pinTop - run.getBoundingClientRect().top) / geo.extra, 0, 1);
          drawFly();
        });
      };
      addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);

    // A typed trade that matches a sample shows that sample. Anything else keeps the samples turning.
    const SAMPLE_FOR = { plumbing: /plumb|drain|pipe/i, hvac: /hvac|heat|cool|air|furnace/i, electrical: /electric/i, roofing: /roof/i, landscaping: /landscap|lawn|garden|tree/i, cleaning: /clean|maid/i };
    tradeInput.addEventListener("input", () => {
      const match = KEYS.find((k) => SAMPLE_FOR[k] && SAMPLE_FOR[k].test(tradeInput.value));
      if (match) { touched = true; goTo(KEYS.indexOf(match)); }
    });
    let typing;
    const onType = () => {
      touched = true;
      clearTimeout(typing);
      typing = setTimeout(() => { paint(index()); paintPhone(); }, 120);
    };
    nameInput.addEventListener("input", onType);
    townInput.addEventListener("input", onType);

    // Slow auto-rotation: stops on hover, focus or any input
    if (!reduced) {
      setInterval(() => { if (!touched && !hovering && flyP < 0.2 && !document.hidden && !stage.contains(document.activeElement)) { cur += 1; spin(); } }, 6000);
      stage.addEventListener("pointerenter", () => { hovering = true; });
      stage.addEventListener("pointerleave", () => { hovering = false; });
    }

    phoneEl.addEventListener("click", () => { location.href = panels[index()].href; });

    // Swipe or drag to spin
    let startX = null;
    let dragged = false;
    stage.addEventListener("pointerdown", (e) => { startX = e.clientX; dragged = false; });
    addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 30) {
        dragged = true;
        touched = true;
        cur += dx < 0 ? 1 : -1;
        spin();
      }
    });
    stage.addEventListener("click", (e) => { if (dragged) e.preventDefault(); }, true);
    stage.addEventListener("dragstart", (e) => e.preventDefault());

    // The hero form hands its answers to the main form
    $("#builder").addEventListener("submit", (e) => {
      e.preventDefault();
      $("#ask-business").value = nameInput.value.trim();
      $("#ask-town").value = townInput.value.trim();
      $("#ask-trade").value = tradeInput.value.trim();
      $("#ask-email").value = $("#try-email").value.trim();
      goToForm();
    });
  }

  // ----- Home: the site assembles as you scroll -----
  const buildSection = $("#build");
  if (buildSection) {
    const layers = $$("#build-rig .ly");
    const items = $$("#build-steps li");
    const count = $("#build-count");
    const bar = $("#build-bar");
    const update = () => {
      const box = buildSection.getBoundingClientRect();
      const p = reduced ? 1 : clamp(-box.top / (box.height - innerHeight), 0, 1);
      // Each layer lands in its own part of the scroll. The last stretch holds the finished site.
      layers.forEach((layer) => {
        const start = ((Number(layer.dataset.step) - 1) / items.length) * 0.86;
        layer.style.setProperty("--v", clamp((p - start) / 0.09, 0, 1).toFixed(3));
      });
      const at = Math.min(items.length - 1, Math.floor((p / 0.86) * items.length));
      items.forEach((li, i) => {
        li.classList.toggle("is-on", i <= at);
        li.classList.toggle("is-cur", i === at);
      });
      count.textContent = `Step ${at + 1} of ${items.length}`;
      bar.style.setProperty("--done", ((at + 1) / items.length).toFixed(2));
    };
    // Fit the whole mockup, with its pop-out cards, inside the space it has
    const stageBox = $(".build-stage");
    const rig = $("#build-rig");
    const fit = () => {
      const scale = Math.min(stageBox.clientWidth / 750, stageBox.clientHeight / 530, 1.2);
      rig.style.setProperty("--bs", scale.toFixed(3));
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", () => { update(); fit(); });
    update();
    fit();
  }

  // ----- Flip cards -----
  $$(".flip").forEach((card) => {
    card.setAttribute("aria-pressed", "false");
    card.addEventListener("click", () => {
      const on = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(on));
    });
  });

  // ----- Payback calculator -----
  $$("[data-calc]").forEach((calc) => {
    const range = $(".calc-range", calc);
    const update = () => {
      const plan = $("input[type=radio]:checked", calc);
      const profit = Number(range.value);
      const jobs = Math.ceil(Number(plan.value) / profit);
      $("#calc-profit", calc).textContent = "$" + profit.toLocaleString("en-US");
      $("#calc-number", calc).textContent = jobs;
      $("#calc-text", calc).textContent = `${jobs === 1 ? "job" : "jobs"} to pay for ${plan.dataset.name}`;
    };
    calc.addEventListener("input", update);
    update();
  });

  // ----- No website page: search card, 2 seconds per slot -----
  const seek = $("#seek");
  if (seek) {
    const SLOT_MS = 2000;
    const tabs = $$(".seek-tabs button", seek);
    const slots = $$(".seek-slot", seek);
    let at = 0;
    let holds = 0;
    let timer;
    function goSlot(next) {
      if (next === at) return;
      slots[at].classList.remove("is-on");
      slots[at].classList.add("is-out");
      slots[at].setAttribute("aria-hidden", "true");
      tabs[at].classList.remove("is-on");
      tabs[at].setAttribute("aria-pressed", "false");
      slots.forEach((slot, i) => { if (i !== at) slot.classList.remove("is-out"); });
      at = next;
      slots[at].classList.remove("is-out");
      slots[at].classList.add("is-on");
      slots[at].removeAttribute("aria-hidden");
      tabs[at].classList.add("is-on");
      tabs[at].setAttribute("aria-pressed", "true");
    }
    function run() {
      clearTimeout(timer);
      if (reduced || holds > 0) return;
      seek.classList.add("is-running");
      timer = setTimeout(() => {
        if (!document.hidden) goSlot((at + 1) % slots.length);
        run();
      }, SLOT_MS);
    }
    const hold = () => { holds += 1; seek.classList.remove("is-running"); clearTimeout(timer); };
    const release = () => { holds = Math.max(0, holds - 1); run(); };
    tabs.forEach((tab, i) => tab.addEventListener("click", () => goSlot(i)));
    seek.addEventListener("pointerenter", hold);
    seek.addEventListener("pointerleave", release);
    seek.addEventListener("focusin", hold);
    seek.addEventListener("focusout", release);
    run();
  }

  // ----- No website page: sample gallery -----
  const gallery = $("#gallery");
  if (gallery) {
    KEYS.forEach((key) => {
      const tile = document.createElement("a");
      tile.className = "tile";
      tile.href = `sample.html?trade=${key}`;
      tile.setAttribute("data-tilt", "");
      tile.innerHTML = `<div class="tile-view"><div class="tile-host"></div></div><span>${TRADES[key].label}<b>Open the full site</b></span>`;
      gallery.append(tile);
      render($(".tile-host", tile), { trade: key, lite: true });
    });
    const fitAll = () => $$(".tile-host", gallery).forEach((host) => fit(host, 1280));
    fitAll();
    addEventListener("resize", fitAll);
    if (canHover && !reduced) {
      $$(".tile", gallery).forEach((card) => {
        card.addEventListener("pointermove", (e) => {
          const box = card.getBoundingClientRect();
          card.style.setProperty("--tx", ((0.5 - (e.clientY - box.top) / box.height) * 8).toFixed(2) + "deg");
          card.style.setProperty("--ty", (((e.clientX - box.left) / box.width - 0.5) * 10).toFixed(2) + "deg");
        });
        card.addEventListener("pointerleave", () => {
          card.style.removeProperty("--tx");
          card.style.removeProperty("--ty");
        });
      });
    }
  }

  // ----- Redesign page: before and after -----
  const ba = $("#ba");
  if (ba) {
    render($("#ba-site"), { trade: "plumbing", lite: true });
    const fitBa = () => {
      fit($("#ba-site"), 1280);
      fit($(".old-site", ba), 1280);
    };
    fitBa();
    addEventListener("resize", fitBa);
    const range = $("#ba-range");
    const update = () => ba.style.setProperty("--pos", range.value + "%");
    range.addEventListener("input", update);
    update();
  }

  // ----- Redesign page: warning signs -----
  const signs = $("#signs");
  if (signs) {
    signs.addEventListener("change", () => {
      const count = $$("input:checked", signs).length;
      $("#signs-result").textContent =
        count === 0 ? "Tick anything that applies."
        : count < 3 ? `${count} of 7. A free redesign will show you what could change.`
        : `${count} of 7. Your site is probably costing you trust. See what it could look like, for free.`;
    });
  }
})();
