(() => {
  const picker = document.getElementById('libraryTopic');
  const content = document.getElementById('libraryContent');
  const view = document.getElementById('view-library');
  if (!picker || !content || !view) return;

  const style = document.createElement('style');
  style.textContent = `.book-discovery{margin:18px 0;padding:18px;border:1px solid var(--line);border-radius:14px;background:linear-gradient(150deg,rgba(111,76,156,.16),rgba(255,255,255,.02))}.book-discovery h3{margin:5px 0 8px}.book-discovery p{max-width:720px;color:var(--muted)}.book-search-label{display:block;margin:14px 0 6px;font-size:12px}.book-discovery input{width:100%;max-width:520px}.book-card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-top:14px}.book-card{display:flex;min-height:118px;flex-direction:column;align-items:flex-start;gap:9px;padding:14px;text-align:left;border:1px solid var(--line);border-radius:10px;background:rgba(15,12,22,.38);color:var(--text);cursor:pointer}.book-card:hover,.book-card:focus-visible{border-color:var(--gold2);transform:translateY(-1px)}.book-card-author,.book-card-cta{color:var(--muted);font-size:11px}.book-card strong{color:var(--gold2)}.book-card[hidden]{display:none}.book-source a{color:var(--gold2);text-decoration:underline}`;
  document.head.append(style);

  const books = [
    {
      id: 'book-bhrigu',
      title: 'Bhṛgu Saṃhitā',
      author: 'Traditionally attributed to Bhṛgu',
      summary: 'A natal-astrology tradition associated with planetary combinations and life themes. Surviving manuscripts and printed paddhatis vary; this guide presents broad traditional context and does not claim to reproduce a verified personal entry from a Bhṛgu manuscript.',
      link: 'https://ccrs.ku.dk/research/centres-and-projects/zysk/',
      source: 'University of Copenhagen manuscript collection: Bhṛgusaṃhitā catalogue note'
    },
    {
      id: 'book-parashara',
      title: 'Bṛhat Parāśara Horāśāstra',
      author: 'Traditionally attributed to Parāśara',
      summary: 'A major horā work covering grahas, rāśis, bhāvas, divisional charts, yogas, and daśā systems. Read chart factors together; a single placement is not a complete prediction.',
      link: 'https://sanskritdocuments.org/iast/jyotisha/',
      source: 'Sanskrit Documents: Jyotiṣa texts and chapter scans'
    },
    {
      id: 'book-brihat-jataka',
      title: 'Bṛhajjātaka',
      author: 'Varāhamihira',
      summary: 'A classical horā text that organizes natal interpretation around signs, planets, houses, combinations, and timing. The app uses paraphrased concepts and labels them as traditional Jyotiṣa, not established prediction.',
      link: 'https://archive.org/details/brihatjataka00varaiala',
      source: 'Bṛhat Jātaka, 1905 digitized edition'
    },
    {
      id: 'book-phaladipika',
      title: 'Phaladīpikā',
      author: 'Mantreśvara',
      summary: 'A practical classical treatise on interpreting horoscopes through planetary and house conditions, combinations, strength, and periods. Interpretations should be qualified by the full chart and the chosen calculation tradition.',
      link: 'https://ignca.gov.in/Asi_data/6945.pdf',
      source: 'Indira Gandhi National Centre for the Arts digitized edition'
    },
    {
      id: 'book-saravali',
      title: 'Sārāvalī',
      author: 'Kalyāṇa Varma',
      summary: 'A broad classical Jyotiṣa compendium on signs, planets, houses, combinations, and chart interpretation. It is one comparative lens; different texts and lineages may give different emphasis.',
      link: 'https://archive.org/details/dli.csl.7888',
      source: 'Digitized Sārāvalī edition, Central Secretariat Library record'
    },
    {
      id: 'book-jataka-parijata',
      title: 'Jātaka Pārijāta',
      author: 'Vaidyanātha Dīkṣita',
      summary: 'A synthesis of natal-astrology methods, including planetary condition, combinations, and daśā interpretation. In this app it informs comparative explanations rather than deterministic claims.',
      link: 'https://sanskritdocuments.org/doc_z_misc_sociology_astrology/jAtakapArijAtaH.html',
      source: 'Sanskrit Documents: Jātaka Pārijāta text'
    },
    {
      id: 'book-brihat-samhita',
      title: 'Bṛhat Saṃhitā',
      author: 'Varāhamihira',
      summary: 'An encyclopedic saṃhitā work covering traditional natural signs and many non-natal topics alongside astral lore. It complements natal horā texts but is not itself a personal birth-chart report.',
      link: 'https://archive.org/details/Brihatsamhita/mode/1up',
      source: 'Bṛhat Saṃhitā, digitized Sanskrit and English edition'
    },
    {
      id: 'book-raman-beginners',
      title: 'Astrology for Beginners',
      author: 'B. V. Raman',
      summary: 'A concise introduction to Indian astrology for new learners. Use it to build vocabulary and basic chart-reading literacy before moving to specialized classical texts.',
      link: 'https://www.motilalbanarsidass.com/collections/astrology/products/astrology-for-beginners',
      source: 'Motilal Banarsidass publisher catalogue'
    },
    {
      id: 'book-only-astrology',
      title: "The Only Astrology Book You'll Ever Need",
      author: 'Joanna Martine Woolfolk',
      summary: 'A modern Western astrology reference aimed at introductory readers, covering chart components and interpretive basics. It represents a modern Western tradition, distinct from Jyotiṣa.',
      link: 'https://www.simonandschuster.com/books/The-Only-Astrology-Book-Youll-Ever-Need/Joanna-Martine-Woolfolk/9781589796539',
      source: 'Publisher catalogue'
    },
    {
      id: 'book-soul',
      title: 'Astrology for the Soul',
      author: 'Jan Spiller',
      summary: 'A modern Western approach centered on the lunar nodes and self-reflection. Its framework should not be mixed into a Vedic calculation without clearly labeling the tradition.',
      link: 'https://www.penguinrandomhouse.com/books/171161/astrology-for-the-soul-by-jan-spiller/',
      source: 'Penguin Random House publisher page'
    },
    {
      id: 'book-transit',
      title: 'Planets in Transit',
      author: 'Robert Hand',
      summary: 'A modern Western reference for interpreting transits. Transit interpretations require actual, date-specific planetary positions and should be presented as that tradition’s symbolic reading.',
      link: 'https://www.arhatmedia.com/blank-3',
      source: 'Robert Hand / Arhat Media author reference'
    },
    {
      id: 'book-twelve-houses',
      title: 'The Twelve Houses',
      author: 'Howard Sasportas',
      summary: 'A psychological, modern Western discussion of house symbolism. This is an interpretive companion, not a source for calculating a Vedic kundli.',
      link: 'https://www.routledge.com/The-Twelve-Houses/Sasportas/p/book/9780892819652',
      source: 'Routledge publisher catalogue'
    },
    {
      id: 'book-samudrika',
      title: 'Sāmudrika Śāstra',
      author: 'A varied Sanskrit and regional-text tradition',
      summary: 'Sāmudrika traditions interpret bodily features and markings, including palm lines. Different texts and regional lineages vary; these readings are cultural and reflective, not a medical, personality, or factual prediction method.',
      link: 'https://cir.nii.ac.jp/crid/2120870839699118208',
      source: 'CiNii Research catalogue record for a digitized 1896 Sanskrit work'
    },
    {
      id: 'book-matching',
      title: 'How to Match Horoscopes for Marriage',
      author: 'P. V. R. Rayudu',
      summary: 'A modern Jyotiṣa text on horoscope matching. Its point system represents one author’s method; it should not be presented as a relationship verdict or substitute for the consent, values, communication, and lived experience of both partners.',
      link: 'https://www.motilalbanarsidass.com/collections/own-publications/products/how-to-match-horoscopes-for-marriage-a-scientific-model-of-compatibility-points-based-on-moon-and-other-aspects-as-per-hindu-astrology',
      source: 'Motilal Banarsidass publisher listing'
    },
    {
      id: 'book-cheiro-numbers',
      title: "Cheiro's Book of Numbers",
      author: 'Cheiro (William John Warner)',
      summary: 'A historical popular numerology source. Numerology systems differ; this entry does not imply that number symbolism is an astronomical calculation or validated predictor.',
      link: 'https://books.google.com/books/about/Cheiro_s_Book_of_Numbers.html?id=-qMgZzxmN1oC',
      source: 'Google Books bibliographic record'
    },
    {
      id: 'book-waite-tarot',
      title: 'The Pictorial Key to the Tarot',
      author: 'Arthur Edward Waite; illustrations by Pamela Colman Smith',
      summary: 'A primary historical text for the Rider–Waite–Smith tarot tradition. Card meanings are presented as a historical symbolic system, not fixed facts or predictions.',
      link: 'https://sacred-texts.com/tarot/pkt/pkttp.htm',
      source: 'Digitized 1911 text'
    }
  ];

  const bookCategories = {
    'book-samudrika': 'Samudrika', 'book-matching': 'Compatibility',
    'book-cheiro-numbers': 'Numerology', 'book-waite-tarot': 'Tarot',
    'book-only-astrology': 'Western astrology', 'book-soul': 'Western astrology',
    'book-transit': 'Western astrology', 'book-twelve-houses': 'Western astrology'
  };
  const videoResources = [
    { category: 'Birth chart · Jyotiṣa', title: 'Sun Mahadasha · Vimshottari Dasha Masterclass', creator: 'Komilla Sutton', link: 'https://www.youtube.com/watch?v=gTWir85IZ-4', note: 'Traditional Jyotiṣa teaching example. Study the stated method; do not treat an anecdotal case as a guaranteed outcome.' },
    { category: 'Birth chart · Jyotiṣa', title: 'Dasha of Retrograde Planets', creator: 'Komilla Sutton', link: 'https://www.youtube.com/watch?v=_DQgwrezxCQ', note: 'A second Jyotiṣa lecture on daśā interpretation. Context, chart calculation, and lineage affect interpretation.' },
    { category: 'Birth chart · Western astrology', title: 'Transits in Astrology: An Introduction to Timing', creator: 'The Astrology Podcast · Chris Brennan and Leisa Schaim', link: 'https://theastrologypodcast.com/2022/08/24/transits-in-astrology/', note: 'Western astrology lesson on transits and timing; keep this interpretive framework distinct from sidereal Jyotiṣa.' },
    { category: 'Compatibility', title: 'Horoscope matching · relationship discussion', creator: 'Guest discussion on YouTube', link: 'https://www.youtube.com/watch?v=BQ1DH5jwcr0', note: 'A popular discussion example; compare its claims with source texts and do not use it as a relationship decision rule.' },
    { category: 'Compatibility', title: 'Is horoscope matching necessary? · discussion', creator: 'Guest discussion on YouTube', link: 'https://www.youtube.com/watch?v=81ZZUmMViSo', note: 'A second perspective on matching. Use it to explore viewpoints, not to decide another person’s future or eligibility.' },
    { category: 'Numerology', title: 'Cheiro method · numerology walkthrough', creator: 'YouTube learning reference', link: 'https://www.youtube.com/watch?v=RYFyuXAnN_I', note: 'A walkthrough of one Chaldean numerology method; number systems vary and this is not evidence of predictive accuracy.' },
    { category: 'Tarot', title: 'How to read Tarot cards with confidence', creator: 'Biddy Tarot', link: 'https://pages.biddytarot.com/video-tarot-card-meanings', note: 'A beginner video lesson; Tarot is used here as a reflective practice.' },
    { category: 'Samudrika', title: 'Jyotish and Hasta Samudrika · lecture series', creator: 'The Ayurvedic Institute · Vasant Lad', link: 'https://ayurveda.com/video_stream/ancient-sister-sciences-an-exploration-into-the-living-wisdom-of-yoga-pranayama-jyotish-vastu-and-palmistry-from-an-ayurvedic-perspective/', note: 'An institutional lecture reference introducing Jyotish and palmistry in an Ayurvedic context.' }
  ];

  const existingHandler = picker.onchange;
  const options = books.map(book => `<option value="${book.id}">${book.title}</option>`).join('');
  picker.insertAdjacentHTML('beforeend', options);

  const section = document.createElement('section');
  section.className = 'book-discovery';
  section.innerHTML = `
    <div class="book-discovery-head">
    <span class="smallcap">ASTROLOGY READING LIBRARY</span>
      <h3>Discover books &amp; topics</h3>
      <p>Explore Vedic and Western traditions separately, with concise source-aware notes. Select a topic, then listen in your chosen language.</p>
      <label class="book-search-label" for="bookSearch">Search books and topics</label>
      <input id="bookSearch" type="search" placeholder="Try Bhṛgu, daśā, grahas…" autocomplete="off">
    </div>
    <div class="book-card-grid" id="bookCards"></div>`;
  const existingContent = content.parentElement;
  existingContent.insertBefore(section, content);
  const grid = section.querySelector('#bookCards');
  const search = section.querySelector('#bookSearch');

  grid.innerHTML = books.map(book => `
    <button type="button" class="book-card" data-book="${book.id}" aria-label="Read about ${book.title}">
      <span class="book-card-author">${bookCategories[book.id] || 'Vedic astrology'} · ${book.author}</span>
      <strong>${book.title}</strong>
      <span class="book-card-cta">Open topic ↗</span>
    </button>`).join('');

  const videos = document.createElement('section');
  videos.className = 'book-discovery video-discovery';
  videos.innerHTML = `<span class="smallcap">VIDEO STUDY REFERENCES</span><h3>Explore by astrology section</h3><p>These videos are optional learning sources. The app does not scrape them, reproduce their content, or use anecdotes as proof of prediction accuracy.</p><div class="book-card-grid">${videoResources.map(video => `<a class="book-card" href="${video.link}" target="_blank" rel="noopener noreferrer"><span class="book-card-author">${video.category} · ${video.creator}</span><strong>${video.title}</strong><span class="book-card-cta">Open source ↗</span><span class="book-card-author">${video.note}</span></a>`).join('')}</div>`;
  section.after(videos);

  const language = typeof liveLanguage !== 'undefined' ? liveLanguage : (window.liveLanguage || 'en');
  const translate = typeof translateFragment === 'function' ? translateFragment : window.translateFragment;
  if (language !== 'en' && typeof translate === 'function') {
    Promise.all([translate(section, language, 'en'), translate(videos, language, 'en')]).catch(() => {
      if (typeof toast === 'function') toast('Library translation needs GOOGLE_TRANSLATE_API_KEY on the app server.');
    });
  }
  document.getElementById('language')?.addEventListener('change', event => {
    const target = event.target.value;
    if (target !== 'en' && typeof translate === 'function') {
      Promise.all([translate(section, target, 'en'), translate(videos, target, 'en')]).catch(() => {});
    }
  });

  function selectBook(id) {
    const book = books.find(item => item.id === id);
    if (!book) return;
    picker.value = book.id;
    content.innerHTML = `
      <h3>${book.title}</h3>
      <p><b>Tradition:</b> ${book.author}</p>
      <p>${book.summary}</p>
      <p><b>How this guide uses the source:</b> It paraphrases high-level interpretive ideas. It does not reproduce a book translation or claim that a specific prediction is a quotation.</p>
      <p class="book-source"><b>Reference:</b> <a href="${book.link}" target="_blank" rel="noopener noreferrer">${book.source}</a></p>
      <p>Birth-specific interpretations require a calculated chart. Where planetary positions are unavailable, this page stays educational and does not invent placements or daśā dates.</p>`;
    content.classList.add('show');
    const currentLanguage = typeof liveLanguage !== 'undefined' ? liveLanguage : (window.liveLanguage || 'en');
    const translator = typeof translateFragment === 'function' ? translateFragment : window.translateFragment;
    if (currentLanguage !== 'en' && typeof translator === 'function') {
      translator(content, currentLanguage, 'en').catch(() => {
        if (typeof window.toast === 'function') window.toast('Book-topic translation needs the configured translation service.');
      });
    }
  }

  grid.addEventListener('click', event => {
    const card = event.target.closest('[data-book]');
    if (card) selectBook(card.dataset.book);
  });
  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase();
    grid.querySelectorAll('[data-book]').forEach(card => {
      card.hidden = query !== '' && !card.innerText.toLocaleLowerCase().includes(query);
    });
  });
  picker.onchange = async () => {
    if (books.some(book => book.id === picker.value)) {
      selectBook(picker.value);
      return;
    }
    try { await existingHandler?.call(picker); } catch (error) { /* Existing topic handler reports its own issue. */ }
  };

  const listen = document.getElementById('readTopic');
  if (listen) listen.textContent = 'Listen to discover this topic';
})();
