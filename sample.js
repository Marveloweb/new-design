// Renders a complete local-business site into any element. Also the starting point for client previews.
// Every sample is a made-up business. Photos are from Unsplash and get replaced with the client's own.
// lite: true draws just the top of the site, for mockups. full: true draws the whole site with its inner pages.
(function () {
  const photo = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w || 1100}&q=70`;
  const PHONE = "(555) 010-0100";
  const TEL = "tel:+15550100100";

  const TRADES = {
    plumbing: {
      label: "Plumbing", biz: "Rivera Plumbing", variant: "over", font: "'Archivo', sans-serif",
      deep: "#062B57", accent: "#0A6EDB", pop: "#FFC21A", popInk: "#062B57", soft: "#E8F2FD",
      head: "Fast, honest plumbing in {town}", sub: "Leaks, clogs and water heaters fixed by a local plumber who answers the phone.",
      hero: "1676210134188-4c05dd172f89", about: "1749532125405-70950966b0e5",
      strip: ["Upfront pricing", "Same-day appointments", "Licensed and insured", "Local to {town}"],
      services: [["Leaks and drains", "Dripping, backed up or burst. Call and we'll sort it.", "1676210134190-3f2c0d5cf58d", "From $129"], ["Water heaters", "Repairs and new installs, tank or tankless.", "1749532125405-70950966b0e5", "From $179"], ["Kitchens and baths", "Faucets, toilets, showers and fixtures.", "1585704032915-c3400ca199e7", "From $149"]],
      more: [["Sewer lines", "Camera inspections, then a repair plan you can read."], ["Water pressure", "Too weak or too strong, we find out why."], ["Gas lines", "Leak checks and new lines for appliances."]],
      steps: [["Call or book online", "Tell us what's going on. A real plumber picks up."], ["Get your price first", "We look at the job and give you the price before we start."], ["We fix it", "Shoe covers on, tools out, and the mess goes with us."], ["Check it together", "We test the repair in front of you and explain the warranty."]],
      stats: [["14", "years in {town}"], ["2,400+", "jobs finished"], ["1 year", "warranty on labor"]],
      aboutTitle: "A family plumber, not a call center", aboutText: "Carlos Rivera started this business with one van. Today his crew still answers its own phone, shows up when it says it will, and gives you the price before any work starts.",
      work: [["1676210133055-eab6ef033ce3", "Under-sink leak repaired"], ["1542013936693-884638332954", "New kitchen faucet"], ["1650551182991-b07558247564", "Pipework replaced"], ["1761758674188-2b8e4c89c5e2", "Pressure valve fitted"]],
      prices: [["Drain cleaning", "$129 to $249"], ["Faucet replacement", "$149 to $299"], ["Toilet repair", "$119 to $259"], ["Water heater repair", "$179 to $449"], ["New tank water heater", "$1,250 to $1,900"]],
      reviews: [["Our water heater quit on a Sunday. They came the same day, explained the options and charged what they quoted.", "Dana M.", "Homeowner"], ["The only plumber I've called who actually called back. Clean, quick and fair.", "Luis T.", "Homeowner"], ["We use them for all three of our rentals. Tenants like them too.", "Priya S.", "Landlord"]],
      faq: [["Do you charge to come out?", "The visit fee is $49, and it comes off the bill if you go ahead with the work."], ["Can you come today?", "Usually yes. Call before noon and we can normally get to you the same day."], ["Do you handle emergencies?", "Yes. If water is running, shut off the main valve and call us."], ["Are you licensed?", "Yes. We're licensed and insured, and we'll show you the paperwork when we arrive."]],
      hours: [["Monday to Friday", "7am to 7pm"], ["Saturday", "8am to 4pm"], ["Sunday", "Emergencies only"]],
      book: [["Leak or drain visit", "About 1 hour", "From $129"], ["Water heater check", "About 90 minutes", "From $179"], ["Fixture install", "About 2 hours", "From $149"], ["Not sure, need a look", "About 30 minutes", "$49 visit"]],
      urgent: "Water running right now? Don't wait for a slot."
    },
    hvac: {
      label: "Heating and cooling", biz: "Northwind Air", variant: "split", font: "'Archivo', sans-serif",
      deep: "#12324F", accent: "#E5352B", pop: "#18A0E8", popInk: "#FFFFFF", soft: "#EDF5FB",
      head: "Stay comfortable in {town}, all year", sub: "AC and furnace repairs, new systems and seasonal tune-ups.",
      hero: "1770625467384-304e461ef1be", about: "1642749776312-aa42ce20c9f5",
      strip: ["Fixed-price repairs", "Same-day AC service", "Financing available", "Local to {town}"],
      services: [["AC repair", "Get cool air back without the runaround.", "1642749776312-aa42ce20c9f5", "From $99"], ["Furnace repair", "Heat that works when you need it.", "1660330590022-9f4ff56b63f6", "From $99"], ["Smart thermostats", "Installed, connected and explained.", "1770625467384-304e461ef1be", "From $189"]],
      more: [["New systems", "Sized for your home, with a written quote."], ["Tune-ups", "Spring and fall checks that stop surprise breakdowns."], ["Air quality", "Filters, humidifiers and duct cleaning."]],
      steps: [["Tell us the symptom", "Warm air, strange noise or no power. Call or book online."], ["We diagnose it", "A technician finds the cause and shows you what's wrong."], ["Choose your option", "Repair or replace, with a fixed price for each."], ["Back to comfortable", "We finish the job, test it and clean up."]],
      stats: [["11", "years in {town}"], ["6,000+", "systems serviced"], ["10 year", "parts warranty on new systems"]],
      aboutTitle: "Straight answers about your system", aboutText: "We won't sell you a new unit if a repair will do. Northwind's technicians show you what they found, and you get a fixed price before any work starts.",
      work: [["1660330589693-99889d60181e", "Blower motor replaced"], ["1705579605238-24a90c8799c5", "Rooftop unit serviced"], ["1625148230889-8195e85aae6b", "Annual tune-up"], ["1770625467384-304e461ef1be", "Smart thermostat added"]],
      prices: [["Diagnostic visit", "$89"], ["AC tune-up", "$119"], ["Capacitor replacement", "$149 to $289"], ["Furnace repair", "$99 to $599"], ["New AC system", "$5,200 to $8,900"]],
      reviews: [["Our AC died in July. They fixed it that afternoon and didn't try to sell me a new one.", "Marcus L.", "Homeowner"], ["Clear prices, on time and very polite. I've signed up for the yearly plan.", "Ana R.", "Homeowner"], ["They replaced our office unit over a weekend, so we never closed.", "Jen K.", "Shop owner"]],
      faq: [["How much is a service call?", "A diagnostic visit is $89, and it comes off the repair if you go ahead."], ["Repair or replace?", "If your system is under 10 years old, a repair is usually the better choice. We'll show you the numbers for both."], ["Do you offer financing?", "Yes, on new systems. We'll explain the terms before you decide."], ["Which brands do you service?", "All major brands of AC, furnace and heat pump."]],
      hours: [["Monday to Friday", "7am to 8pm"], ["Saturday", "8am to 6pm"], ["Sunday", "Emergencies only"]],
      book: [["AC repair visit", "About 90 minutes", "$89 diagnostic"], ["Furnace repair visit", "About 90 minutes", "$89 diagnostic"], ["Seasonal tune-up", "About 1 hour", "$119"], ["New system estimate", "About 45 minutes", "Free"]],
      urgent: "No heat or no cooling today? Call and skip the queue."
    },
    electrical: {
      label: "Electrical", biz: "Bright Line Electric", variant: "over", font: "'Archivo', sans-serif",
      deep: "#15171C", accent: "#FFC800", pop: "#FFC800", popInk: "#15171C", soft: "#F3F1E6",
      head: "Electrical work done right in {town}", sub: "Panels, wiring, lighting and EV chargers for homes and small shops.",
      hero: "1621905251189-08b45d6a269e", about: "1758101755915-462eddc23f57",
      strip: ["Licensed electricians", "Permits handled", "Written quotes", "Local to {town}"],
      services: [["Panel upgrades", "More capacity and safer power.", "1758101755915-462eddc23f57", "From $1,400"], ["Wiring and outlets", "New circuits, repairs and troubleshooting.", "1621905251189-08b45d6a269e", "From $120"], ["Lighting", "Indoor and outdoor, planned and installed.", "1784258074509-dfebb3bbf34e", "From $150"]],
      more: [["EV chargers", "Level 2 charger installs, with the permit handled."], ["Safety inspections", "For buying, selling or peace of mind."], ["Shop and office work", "Small commercial fit-outs and repairs."]],
      steps: [["Describe the job", "Send a photo or tell us what's happening."], ["Get a written quote", "Materials, labor and permit, all listed."], ["We do the work", "Licensed electricians, tidy work and power back on fast."], ["Inspected and signed off", "We book the inspection and hand you the paperwork."]],
      stats: [["9", "years in {town}"], ["3,100+", "jobs finished"], ["100%", "permitted work"]],
      aboutTitle: "Safe work you never have to think about again", aboutText: "Bad wiring hides behind walls. Bright Line does the job properly, pulls the permit when one is needed, and leaves you with a clear record of what was done.",
      work: [["1682345262055-8f95f3c513ea", "Rewired a home office"], ["1635335874521-7987db781153", "Junction box cleaned up"], ["1544724569-5f546fd6f2b5", "New breaker panel"], ["1646640381839-02748ae8ddf0", "New outlets installed"]],
      prices: [["Outlet or switch", "$120 to $220"], ["Ceiling fan install", "$180 to $350"], ["EV charger install", "$650 to $1,500"], ["Panel upgrade", "$1,400 to $3,200"], ["Safety inspection", "$149"]],
      reviews: [["They found the fault two other electricians missed, and the price stayed exactly as quoted.", "Tom B.", "Homeowner"], ["Our EV charger was in and working in one morning. They handled the permit too.", "Sara W.", "Homeowner"], ["Reliable for our shop. They always turn up when they say they will.", "Omar H.", "Shop owner"]],
      faq: [["Do I need a permit?", "Most panel and new-circuit work needs one. We tell you up front and handle it for you."], ["Can you work after hours?", "Yes, for shops and offices we can schedule around your opening hours."], ["Can you install my EV charger?", "Yes. We check your panel first, then give you a written price."], ["Is the work guaranteed?", "All our work has a two-year labor warranty."]],
      hours: [["Monday to Friday", "7:30am to 6pm"], ["Saturday", "9am to 2pm"], ["Sunday", "Closed"]],
      book: [["Repair or troubleshooting", "About 1 hour", "From $120"], ["EV charger estimate", "About 30 minutes", "Free"], ["Panel upgrade estimate", "About 45 minutes", "Free"], ["Safety inspection", "About 90 minutes", "$149"]],
      urgent: "Sparks or a burning smell? Turn off the breaker and call."
    },
    roofing: {
      label: "Roofing", biz: "Summit Roofing Co.", variant: "card", font: "'Zilla Slab', serif",
      deep: "#2B2A33", accent: "#D9531E", pop: "#D9531E", popInk: "#FFFFFF", soft: "#F6EFE7",
      head: "A roof you can stop worrying about", sub: "Repairs, replacements and storm damage across {town}.",
      hero: "1635424824849-1b09bdcc55b1", about: "1632759145351-1d592919f522",
      strip: ["Free roof inspections", "Insurance paperwork help", "Clean job sites", "Local to {town}"],
      services: [["Roof repair", "Leaks and missing shingles, fixed.", "1632759145351-1d592919f522", "From $350"], ["Full replacement", "Clear pricing, tidy work site.", "1643225523483-e2c434191bba", "From $8,500"], ["Storm damage", "We inspect it and explain what we find.", "1635424824849-1b09bdcc55b1", "Free inspection"]],
      more: [["Gutters", "New gutters, guards and repairs."], ["Metal roofing", "Long-lasting roofs for homes and shops."], ["Skylights", "Leak repairs and new installs."]],
      steps: [["Book a free inspection", "We climb up, take photos and show you exactly what we see."], ["Get a clear proposal", "Materials, price and timeline in writing."], ["We replace or repair", "Most roofs are done in one or two days."], ["Final walkaround", "We clear every nail and hand you the warranty."]],
      stats: [["18", "years in {town}"], ["1,900+", "roofs finished"], ["25 year", "material warranty"]],
      aboutTitle: "Photos first, then a fair price", aboutText: "You can't see your roof, so we show you. Every Summit inspection comes with photos and a plain report, so you know what needs fixing and what doesn't.",
      work: [["1763665814538-8ba04597286c", "Tile roof replaced"], ["1633759593085-1eaeb724fc88", "Damaged shingles removed"], ["1779941373840-a93f6e0d5db0", "New metal roof"], ["1780445392484-5fb7d5610708", "Metal panels fastened"]],
      prices: [["Roof inspection", "Free"], ["Leak repair", "$350 to $900"], ["Gutter replacement", "$900 to $2,400"], ["Shingle replacement", "$8,500 to $16,000"], ["Metal roof", "$14,000 to $28,000"]],
      reviews: [["After the hail storm they showed me photos and helped with my insurance claim from start to finish.", "Beth C.", "Homeowner"], ["New roof done in two days. Not one nail left in the yard.", "Greg P.", "Homeowner"], ["They told me I only needed a repair, not a new roof. That earned my trust.", "Nina F.", "Homeowner"]],
      faq: [["Is the inspection really free?", "Yes. You get photos and a written report, with no obligation."], ["Will you work with my insurance?", "Yes. We document the damage and can meet your adjuster on site."], ["How long does a new roof take?", "Most homes take one or two days, depending on size and weather."], ["What warranty do I get?", "A 25-year material warranty and a 10-year warranty on our labor."]],
      hours: [["Monday to Friday", "7am to 6pm"], ["Saturday", "8am to 2pm"], ["Sunday", "Closed"]],
      book: [["Free roof inspection", "About 45 minutes", "Free"], ["Leak repair visit", "About 2 hours", "From $350"], ["Replacement estimate", "About 1 hour", "Free"], ["Storm damage check", "About 45 minutes", "Free"]],
      urgent: "Active leak after a storm? Call for a tarp today."
    },
    landscaping: {
      label: "Landscaping", biz: "Greenway Lawn & Garden", variant: "split", font: "'DM Serif Display', serif",
      deep: "#123D25", accent: "#3E8E41", pop: "#F6D743", popInk: "#123D25", soft: "#EEF5E6",
      head: "The best yard on your street", sub: "Weekly mowing, planting and cleanups in {town}.",
      hero: "1734303023491-db8037a21f09", about: "1724556295135-ff92b9aa0a55",
      strip: ["Free yard visits", "Same crew every week", "No contracts", "Local to {town}"],
      services: [["Lawn care", "Mowing, edging and seasonal care.", "1734303023491-db8037a21f09", "From $45 a visit"], ["Planting", "Beds, shrubs and trees that suit your yard.", "1597201278257-3687be27d954", "From $300"], ["Yard cleanups", "Spring and fall, hauled away.", "1621272156568-7306716648df", "From $180"]],
      more: [["Patios and paths", "Stone and brick, laid to last."], ["Irrigation", "Install, repair and seasonal setup."], ["Tree and shrub care", "Pruning and shaping through the year."]],
      steps: [["Walk the yard together", "A free visit to hear what you'd like."], ["Get a simple plan", "What we'll do, when and for how much."], ["Your crew gets to work", "The same people on the same day, week after week."], ["Enjoy the view", "We text you when each visit is done."]],
      stats: [["12", "years in {town}"], ["450+", "yards cared for"], ["1 crew", "the same team each week"]],
      aboutTitle: "Your yard, looked after by people you know", aboutText: "Greenway keeps its crews small and its routes local. You'll see the same faces each week, and they'll learn what your garden needs through every season.",
      work: [["1700689807667-82630348b301", "Brick path and borders"], ["1668120089662-42642838cfef", "Full lawn renovation"], ["1633330948542-0b3bdeefcdb3", "New patio and planting"], ["1692339699736-acb2a3a06b58", "Cottage garden path"]],
      prices: [["Weekly mowing", "$45 to $85 a visit"], ["Seasonal cleanup", "$180 to $450"], ["Mulch and beds", "$300 to $900"], ["Irrigation repair", "$120 to $350"], ["Patio install", "$3,500 to $12,000"]],
      reviews: [["Same crew every Thursday. My lawn has never looked this good, and the neighbors keep asking who does it.", "Holly D.", "Homeowner"], ["They turned a muddy corner into my favorite part of the house.", "Ravi N.", "Homeowner"], ["They always text when they're done, and billing is painless.", "Carol A.", "Homeowner"]],
      faq: [["Do I need a contract?", "No. Weekly care runs month to month, and you can stop any time."], ["When do you start?", "Most new yards start within one week of the visit."], ["Do you remove the clippings?", "Yes, or we mulch them back into the lawn if you prefer."], ["Do you work in winter?", "We switch to cleanups, pruning and planning in the cold months."]],
      hours: [["Monday to Friday", "7am to 6pm"], ["Saturday", "8am to 3pm"], ["Sunday", "Closed"]],
      book: [["Free yard visit", "About 30 minutes", "Free"], ["One-time mow", "About 1 hour", "From $65"], ["Seasonal cleanup", "About 3 hours", "From $180"], ["Planting consultation", "About 45 minutes", "Free"]],
      urgent: "Big event coming up? Call and we'll fit you in."
    },
    cleaning: {
      label: "House cleaning", biz: "Fresh Nest Cleaning", variant: "card", font: "'DM Serif Display', serif",
      deep: "#0E3A47", accent: "#12A5A0", pop: "#FF7E67", popInk: "#2B0F0A", soft: "#E8F7F6",
      head: "Come home to a spotless house", sub: "Regular, deep and move-out cleaning across {town}.",
      hero: "1758273238415-01ec03d9ef27", about: "1758273705627-937374bfa978",
      strip: ["Background-checked team", "Supplies included", "Happiness guarantee", "Local to {town}"],
      services: [["Regular cleaning", "Weekly or every other week.", "1758273705627-937374bfa978", "From $120"], ["Deep cleaning", "The corners that get missed.", "1758273238415-01ec03d9ef27", "From $240"], ["Move-out cleaning", "Leave the place ready for handover.", "1646980241033-cd7abda2ee88", "From $280"]],
      more: [["Kitchen deep cleans", "Inside the oven, fridge and cabinets."], ["Office cleaning", "Before or after your opening hours."], ["Rental turnovers", "Fast cleans between guests."]],
      steps: [["Pick your clean", "Choose the size of your home and a time."], ["We confirm by text", "You'll know who's coming and when."], ["We clean, you relax", "We bring the supplies and follow your checklist."], ["Tell us how it went", "Not happy? We come back within 24 hours and fix it."]],
      stats: [["7", "years in {town}"], ["12,000+", "homes cleaned"], ["24 hour", "happiness guarantee"]],
      aboutTitle: "A clean you don't have to check", aboutText: "Fresh Nest's cleaners are background-checked, paid well and work from your own checklist. That's why our customers stop looking around after we leave.",
      work: [["1773579305267-8d75e0af5be4", "Kitchen deep clean"], ["1585421514284-efb74c2b69ba", "Surfaces wiped and shined"], ["1581578731548-c64695cc6952", "Weekly clean"], ["1686178827149-6d55c72d81df", "Floors and carpets"]],
      prices: [["1 bed, regular clean", "$120"], ["2 bed, regular clean", "$150"], ["3 bed, regular clean", "$185"], ["Deep clean", "$240 to $420"], ["Move-out clean", "$280 to $480"]],
      reviews: [["I came home and just stood in the kitchen smiling. It's the same two cleaners each time, and they remember everything.", "Tara J.", "Homeowner"], ["My landlord gave back my whole deposit after their move-out clean.", "Ben O.", "Renter"], ["Booking takes a minute, and they've never once missed a visit.", "Mei C.", "Homeowner"]],
      faq: [["Do I need to be home?", "No. Many customers give us a door code or a key, and we text when we finish."], ["Do you bring supplies?", "Yes, all of them. Tell us if you'd like us to use your products instead."], ["What if I'm not happy?", "Tell us within 24 hours and we'll come back to fix it for free."], ["Can I skip a week?", "Yes. Just give us 48 hours' notice."]],
      hours: [["Monday to Friday", "8am to 6pm"], ["Saturday", "9am to 4pm"], ["Sunday", "Closed"]],
      book: [["Regular clean", "About 2 hours", "From $120"], ["Deep clean", "About 4 hours", "From $240"], ["Move-out clean", "About 5 hours", "From $280"], ["Kitchen only", "About 2 hours", "From $140"]],
      urgent: "Moving out this week? Call and we'll find you a slot."
    }
  };

  const esc = (text) => String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const ICONS = {
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>'
  };
  const icon = (name) => `<svg class="sx-ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

  // Working days from tomorrow, for the booking calendar
  function nextDays(count) {
    const out = [];
    const day = new Date();
    while (out.length < count) {
      day.setDate(day.getDate() + 1);
      if (day.getDay() !== 0) out.push({ wk: day.toLocaleDateString("en-US", { weekday: "short" }), num: day.getDate(), mon: day.toLocaleDateString("en-US", { month: "short" }) });
    }
    return out;
  }
  const TIMES = ["8:00 am", "10:30 am", "1:00 pm", "3:30 pm"];

  function build(t, name, town, w) {
    const fill = (s) => s.replace(/\{town\}/g, town);
    const head = (title, sub) => `<div class="sx-head"><h3>${fill(title)}</h3>${sub ? `<p>${fill(sub)}</p>` : ""}</div>`;
    const field = (label, type, extra) => `<label>${label}<input type="${type}" required ${extra || ""}></label>`;

    const parts = {
      chrome() {
        return `
        <div class="sx-top"><span>Serving ${town} and nearby towns</span><a href="${TEL}">Call ${PHONE}</a></div>
        <header class="sx-nav">
          <a class="sx-brand" href="#home">${name}</a>
          <nav aria-label="${name} pages"><a href="#home" data-v="home">Home</a><a href="#services" data-v="services">Services</a><a href="#work" data-v="work">Our work</a><a href="#contact" data-v="contact">Contact</a></nav>
          <a class="sx-btn" href="#book">Book online</a>
        </header>`;
      },
      hero() {
        return `
        <section class="sx-hero">
          <div class="sx-hero-copy">
            <h1>${fill(t.head)}</h1>
            <p>${fill(t.sub)}</p>
            <div class="sx-actions"><a class="sx-btn" href="${TEL}">Call ${PHONE}</a><a class="sx-btn sx-ghost" href="#book">Book online</a></div>
          </div>
          <form class="sx-quote sx-form">
            <strong>Get a free quote</strong>
            ${field("Your name", "text", 'autocomplete="name"')}
            ${field("Phone number", "tel", 'autocomplete="tel"')}
            <label>What do you need?<textarea rows="2" required></textarea></label>
            <button class="sx-btn sx-full" type="submit">Send my request</button>
            <p class="sx-note" role="status"></p>
          </form>
        </section>`;
      },
      strip: () => `<ul class="sx-strip">${t.strip.map((s) => `<li>${fill(s)}</li>`).join("")}</ul>`,
      services() {
        return `
        <section class="sx-sec sx-services">
          ${head("What we do", `Every job in ${town} gets a clear price before we start.`)}
          <div class="sx-cards">${t.services.map(([title, blurb, id, from]) => `
            <article><img src="${photo(id, 700)}" alt="" loading="lazy"><div><h4>${title}</h4><p>${blurb}</p><span class="sx-from">${from}</span><a class="sx-link" href="#book">Book this</a></div></article>`).join("")}
          </div>
          <ul class="sx-more">${t.more.map(([title, blurb]) => `<li>${icon("check")}<b>${title}</b><span>${blurb}</span></li>`).join("")}</ul>
        </section>`;
      },
      steps() {
        return `
        <section class="sx-sec sx-steps">
          ${head("How it works", "Four simple steps, with no surprises.")}
          <ol>${t.steps.map(([title, text], i) => `<li><i>${i + 1}</i><h4>${title}</h4><p>${text}</p></li>`).join("")}</ol>
        </section>`;
      },
      about() {
        return `
        <section class="sx-about">
          <img src="${photo(t.about, w)}" alt="" loading="lazy">
          <div>
            <h3>${t.aboutTitle}</h3>
            <p>${t.aboutText}</p>
            <dl>${t.stats.map(([num, label]) => `<div><dt>${num}</dt><dd>${fill(label)}</dd></div>`).join("")}</dl>
            <a class="sx-btn" href="#contact">Talk to us</a>
          </div>
        </section>`;
      },
      work() {
        return `
        <section class="sx-sec sx-work">
          ${head("Recent work", `A few jobs from around ${town}.`)}
          <div class="sx-shots">${t.work.map(([id, caption]) => `<figure><img src="${photo(id, 800)}" alt="" loading="lazy"><figcaption>${caption}</figcaption></figure>`).join("")}</div>
        </section>`;
      },
      teaser() {
        const days = nextDays(4);
        return `
        <section class="sx-teaser">
          <div>
            <h3>Book online in under a minute</h3>
            <p>Pick a service and a time that suits you. We'll text to confirm.</p>
            <a class="sx-btn" href="#book">See all times</a>
          </div>
          <ul>${days.map((d, i) => `<li><a href="#book"><b>${d.wk} ${d.num}</b><span>${TIMES[i % TIMES.length]} open</span></a></li>`).join("")}</ul>
        </section>`;
      },
      prices() {
        return `
        <section class="sx-sec sx-prices">
          ${head("Typical prices", "Your exact price is confirmed before any work starts.")}
          <table><tbody>${t.prices.map(([job, price]) => `<tr><th scope="row">${job}</th><td>${price}</td></tr>`).join("")}</tbody></table>
        </section>`;
      },
      reviews() {
        return `
        <section class="sx-sec sx-reviews">
          ${head("What customers say")}
          <div class="sx-review-row">${t.reviews.map(([quote, who, role]) => `
            <blockquote><span class="sx-stars" aria-label="5 stars">★★★★★</span><p>${quote}</p><footer><b>${who}</b> ${role}</footer></blockquote>`).join("")}</div>
          <p class="sx-small">Sample reviews. Yours come from your real customers.</p>
        </section>`;
      },
      area() {
        const spots = ["Downtown", "North side", "South side", "East side", "West side", "Nearby towns"];
        return `
        <section class="sx-area">
          <div>
            <h3>Where we work</h3>
            <p>We're based in ${town} and work across the whole area.</p>
            <ul class="sx-spots">${spots.map((s) => `<li>${icon("pin")}${s}</li>`).join("")}</ul>
            <h4>${icon("clock")}Opening hours</h4>
            <dl class="sx-hours">${t.hours.map(([d, h]) => `<div><dt>${d}</dt><dd>${h}</dd></div>`).join("")}</dl>
          </div>
          <svg class="sx-map" viewBox="0 0 480 360" role="img" aria-label="Map of the service area">
            <rect width="480" height="360" fill="var(--s)"/>
            <path d="M-10 250C90 210 150 300 260 250S420 190 500 220" fill="none" stroke="#fff" stroke-width="16"/>
            <path d="M120-10V370M300-10V370M-10 110H490" fill="none" stroke="#fff" stroke-width="9"/>
            <path d="M210-10L330 370M40 370L180 110" fill="none" stroke="#fff" stroke-width="5"/>
            <circle cx="240" cy="170" r="118" fill="var(--a)" opacity=".18"/>
            <circle cx="240" cy="170" r="118" fill="none" stroke="var(--d)" stroke-width="2" stroke-dasharray="7 7"/>
            <path d="M240 186s24-22 24-42a24 24 0 0 0-48 0c0 20 24 42 24 42z" fill="var(--d)"/><circle cx="240" cy="144" r="9" fill="#fff"/>
          </svg>
        </section>`;
      },
      faq() {
        return `
        <section class="sx-sec sx-faq">
          ${head("Common questions")}
          <div>${t.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
        </section>`;
      },
      cta() {
        return `
        <section class="sx-cta">
          <div><h3>Need help in ${town}?</h3><p>${t.urgent}</p></div>
          <div class="sx-actions"><a class="sx-btn" href="${TEL}">Call ${PHONE}</a><a class="sx-btn sx-ghost" href="#book">Book online</a></div>
        </section>`;
      },
      foot() {
        return `
        <footer class="sx-foot">
          <div><strong class="sx-foot-name">${name}</strong><p>Local ${t.label.toLowerCase()} for ${town} and nearby towns.</p></div>
          <div><b>Pages</b><a href="#home">Home</a><a href="#services">Services</a><a href="#work">Our work</a><a href="#book">Book online</a><a href="#contact">Contact</a></div>
          <div><b>Services</b>${t.services.map(([title]) => `<a href="#services">${title}</a>`).join("")}</div>
          <div><b>Get in touch</b><a href="${TEL}">${PHONE}</a>${t.hours.map(([d, h]) => `<span>${d}: ${h}</span>`).join("")}</div>
        </footer>`;
      },
      page: (title, sub) => `<section class="sx-page"><h1>${fill(title)}</h1><p>${fill(sub)}</p></section>`,
      contact() {
        return `
        <section class="sx-sec sx-contact">
          <form class="sx-quote sx-form">
            <strong>Send us a message</strong>
            ${field("Your name", "text", 'autocomplete="name"')}
            <div class="sx-two">${field("Phone number", "tel", 'autocomplete="tel"')}${field("Email", "email", 'autocomplete="email"')}</div>
            <label>How can we help?<textarea rows="4" required></textarea></label>
            <button class="sx-btn sx-full" type="submit">Send my message</button>
            <p class="sx-note" role="status"></p>
          </form>
          <div class="sx-contact-side">
            <h3>Talk to a real person</h3>
            <p>${t.urgent}</p>
            <a class="sx-btn" href="${TEL}">Call ${PHONE}</a>
            <a class="sx-link" href="#book">Or book online</a>
          </div>
        </section>`;
      },
      book: () => `<section class="sx-sec sx-book" data-booking></section>`
    };

    const VIEWS = {
      home: () => parts.hero() + parts.strip() + parts.services() + parts.steps() + parts.about() + parts.work() + parts.teaser() + parts.reviews() + parts.area() + parts.faq() + parts.cta(),
      services: () => parts.page("Services and prices", `Everything we do in ${town}, with typical prices.`) + parts.services() + parts.prices() + parts.faq() + parts.cta(),
      work: () => parts.page("Our work", `Recent jobs and what customers in ${town} say.`) + parts.work() + parts.about() + parts.reviews() + parts.cta(),
      contact: () => parts.page("Contact us", "Call, book or send a message. We reply the same working day.") + parts.contact() + parts.area(),
      book: () => parts.page("Book online", "Three quick steps. We'll text to confirm your time.") + parts.book()
    };
    return { parts, VIEWS };
  }

  // Three-step booking page
  function startBooking(box, t, town) {
    const days = nextDays(10);
    const st = { step: 1, svc: 0, day: 0, time: 0, name: "", tel: "", addr: "" };
    const stepper = () => `<ol class="sx-stepper">${["Service", "Date and time", "Your details"].map((s, i) => `<li class="${st.step === i + 1 ? "is-cur" : st.step > i + 1 ? "is-done" : ""}"><i>${st.step > i + 1 ? icon("check") : i + 1}</i>${s}</li>`).join("")}</ol>`;
    const picked = () => `${days[st.day].wk} ${days[st.day].mon} ${days[st.day].num}, ${TIMES[st.time]}`;
    const summary = () => `
      <aside class="sx-summary">
        <h4>Your booking</h4>
        <dl>
          <div><dt>Service</dt><dd>${t.book[st.svc][0]}</dd></div>
          <div><dt>Takes</dt><dd>${t.book[st.svc][1]}</dd></div>
          <div><dt>Price</dt><dd>${t.book[st.svc][2]}</dd></div>
          ${st.step > 1 ? `<div><dt>When</dt><dd>${picked()}</dd></div>` : ""}
        </dl>
        <p>${t.urgent} <a href="${TEL}">${PHONE}</a></p>
      </aside>`;
    const STEPS = {
      1: () => `<h3 tabindex="-1">What do you need?</h3><div class="sx-options">${t.book.map(([title, time, price], i) => `<button type="button" data-svc="${i}" aria-pressed="${st.svc === i}"><b>${title}</b><span>${time}</span><em>${price}</em></button>`).join("")}</div><div class="sx-go"><button class="sx-btn" type="button" data-go="2">Continue</button></div>`,
      2: () => `<h3 tabindex="-1">Pick a day</h3><div class="sx-days">${days.map((d, i) => `<button type="button" data-day="${i}" aria-pressed="${st.day === i}"><span>${d.wk}</span><b>${d.num}</b><span>${d.mon}</span></button>`).join("")}</div><h3>Pick a time</h3><div class="sx-times">${TIMES.map((x, i) => `<button type="button" data-time="${i}" aria-pressed="${st.time === i}">${x}</button>`).join("")}</div><div class="sx-go"><button class="sx-back" type="button" data-go="1">Back</button><button class="sx-btn" type="button" data-go="3">Continue</button></div>`,
      3: () => `<h3 tabindex="-1">Where should we come?</h3><form class="sx-details"><label>Your name<input name="name" required autocomplete="name" value="${esc(st.name)}"></label><label>Mobile number<input name="tel" type="tel" required autocomplete="tel" value="${esc(st.tel)}"></label><label>Address in ${town}<input name="addr" required autocomplete="street-address" value="${esc(st.addr)}"></label><div class="sx-go"><button class="sx-back" type="button" data-go="2">Back</button><button class="sx-btn" type="submit">Confirm my booking</button></div></form>`,
      4: () => `<div class="sx-done">${icon("check")}<h3 tabindex="-1">That's how your customers will book</h3><p>${t.book[st.svc][0]} on ${picked()}, for ${esc(st.name)}.</p><p class="sx-small">This is a sample, so nothing was booked or sent.</p><button class="sx-back" type="button" data-go="1">Try it again</button></div>`
    };
    const draw = (focus) => {
      box.innerHTML = st.step === 4 ? STEPS[4]() : `${stepper()}<div class="sx-book-grid"><div class="sx-book-main">${STEPS[st.step]()}</div>${summary()}</div>`;
      if (focus) box.querySelector("h3").focus();
    };
    box.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      const d = b.dataset;
      if (d.svc) st.svc = Number(d.svc);
      else if (d.day) st.day = Number(d.day);
      else if (d.time) st.time = Number(d.time);
      else if (d.go) st.step = Number(d.go);
      else return;
      draw(Boolean(d.go));
    });
    box.addEventListener("input", (e) => { if (e.target.name) st[e.target.name] = e.target.value; });
    box.addEventListener("submit", (e) => { e.preventDefault(); st.step = 4; draw(true); });
    draw(false);
  }

  function render(el, opts) {
    const key = TRADES[opts.trade] ? opts.trade : "plumbing";
    const t = TRADES[key];
    const name = esc((opts.name || "").trim() || t.biz);
    const town = esc((opts.town || "").trim() || "Dallas");
    const w = opts.lite ? 800 : 1100;

    // Keep the host's own classes: the mockups look it up by them.
    el.classList.remove("sx-over", "sx-split", "sx-card");
    el.classList.add("sx", `sx-${t.variant}`);
    el.classList.toggle("sx-lite", Boolean(opts.lite));
    el.classList.toggle("sx-full", Boolean(opts.full));
    el.style.cssText += `;--d:${t.deep};--a:${t.accent};--p:${t.pop};--pi:${t.popInk};--s:${t.soft};--f:${t.font};--hero:url("${photo(t.hero, w + 300)}")`;

    if (!opts.full) {
      // Mockups sit inside links, so nothing here may be a link or a real field.
      const fill = (s) => s.replace(/\{town\}/g, town);
      el.innerHTML = `
        <div class="sx-top"><span>Serving ${town} and nearby towns</span><b>Call ${PHONE}</b></div>
        <header class="sx-nav"><strong class="sx-brand">${name}</strong><nav><span>Services</span><span>Our work</span><span>Reviews</span><span>Contact</span></nav><span class="sx-btn">Book online</span></header>
        <section class="sx-hero">
          <div class="sx-hero-copy">
            <h2>${fill(t.head)}</h2>
            <p>${fill(t.sub)}</p>
            <div class="sx-actions"><span class="sx-btn">Call ${PHONE}</span><span class="sx-btn sx-ghost">Book online</span></div>
          </div>
          <div class="sx-quote">
            <strong>Get a free quote</strong>
            <span class="sx-input">Your name</span>
            <span class="sx-input">Phone number</span>
            <span class="sx-input sx-tall">What do you need?</span>
            <span class="sx-btn sx-full">Send my request</span>
          </div>
        </section>
        <ul class="sx-strip">${t.strip.map((s) => `<li>${fill(s)}</li>`).join("")}</ul>
        <section class="sx-sec sx-services">
          <div class="sx-head"><h3>What we do</h3></div>
          <div class="sx-cards">${t.services.map(([title, blurb, id]) => `<article><img src="${photo(id, 500)}" alt="" loading="lazy"><div><h4>${title}</h4><p>${blurb}</p></div></article>`).join("")}</div>
        </section>`;
      return;
    }

    const { parts, VIEWS } = build(t, name, town, w);
    const show = () => {
      const hash = location.hash.slice(1);
      const view = VIEWS[hash] ? hash : "home";
      el.innerHTML = parts.chrome() + `<main>${VIEWS[view]()}</main>` + parts.foot();
      el.querySelectorAll("[data-v]").forEach((a) => {
        if (a.dataset.v === view) a.setAttribute("aria-current", "page");
      });
      const box = el.querySelector("[data-booking]");
      if (box) startBooking(box, t, town);
      scrollTo(0, 0);
      document.title = `${view === "home" ? "" : el.querySelector("h1").textContent + " | "}${(opts.name || "").trim() || t.biz}`;
    };
    addEventListener("hashchange", show);
    el.addEventListener("submit", (e) => {
      if (!e.target.classList.contains("sx-form")) return;
      e.preventDefault();
      e.target.querySelector(".sx-note").textContent = "This is a sample, so nothing was sent.";
    });
    show();
  }

  window.MarveloSample = { TRADES, render };
})();
