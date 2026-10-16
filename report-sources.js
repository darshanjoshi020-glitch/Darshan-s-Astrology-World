(() => {
  const esc = value => String(value || 'Not provided').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const onBeforePrint = () => {
    const report = document.getElementById('fullHoroscopeReport');
    if (!report || !report.querySelector('.report-page')) return;
    report.querySelector('.classical-source-page')?.remove();

    const hour = document.getElementById('timeHour')?.value;
    const minute = document.getElementById('timeMinute')?.value;
    const second = document.getElementById('timeSecond')?.value;
    const period = document.getElementById('timePeriod')?.value;
    const time = [hour, minute, second].every(Boolean) && period ? `${hour}:${minute}:${second} ${period}` : 'Not provided';
    const timezone = document.getElementById('birthTimezone')?.value || 'Not provided';
    const place = document.getElementById('birthplace')?.value || document.getElementById('birthPlace')?.value || 'Not provided';
    const coordinates = [document.getElementById('birthLatitude')?.value, document.getElementById('birthLongitude')?.value].every(Boolean)
      ? `${document.getElementById('birthLatitude').value}, ${document.getElementById('birthLongitude').value}`
      : 'Not supplied';

    const precision = report.querySelector('.report-page');
    const details = document.createElement('div');
    details.className = 'report-note';
    details.innerHTML = `<b>Birth-time precision:</b> ${esc(time)} · ${esc(timezone)}<br><b>Birthplace:</b> ${esc(place)} · <b>Coordinates:</b> ${esc(coordinates)}. Coordinates are shown only when supplied by the selected-place lookup.`;
    precision.appendChild(details);

    const page = document.createElement('article');
    page.className = 'report-page classical-source-page';
    page.innerHTML = `<div class="report-brand">DARSHAN'S ASTROLOGY WORLD</div>
      <h2>Reading references and method</h2>
      <p>This report's educational explanations draw on the following distinct traditions. Titles are references for study; they are not a claim that every prediction in a report is directly quoted from, or validated by, these books.</p>
      <h3>Vedic astrology · Jyotiṣa</h3>
      <ul><li>Bṛhat Parāśara Horāśāstra · traditionally attributed to Parāśara</li><li>Bṛhajjātaka · Varāhamihira</li><li>Phaladīpikā · Mantreśvara</li><li>Sārāvalī · Kalyāṇa Varma</li><li>Jātaka Pārijāta · Vaidyanātha Dīkṣita</li><li>Bhṛgu Saṃhitā · Bhṛgu tradition; manuscript recensions vary</li><li>Astrology for Beginners · B. V. Raman</li><li>Sāmudrika Śāstra · varied Sanskrit and regional-text traditions</li><li>How to Match Horoscopes for Marriage · P. V. R. Rayudu</li></ul>
      <h3>Western astrology</h3>
      <ul><li>The Only Astrology Book You'll Ever Need · Joanna Martine Woolfolk</li><li>Astrology for the Soul · Jan Spiller</li><li>Planets in Transit · Robert Hand</li><li>The Twelve Houses · Howard Sasportas</li></ul>
      <h3>Numerology and Tarot</h3>
      <ul><li>Cheiro's Book of Numbers · Cheiro (William John Warner)</li><li>The Pictorial Key to the Tarot · Arthur Edward Waite; illustrations by Pamela Colman Smith</li></ul>
      <h3>Selected video study references</h3>
      <ul><li>Komilla Sutton · Sun Mahadasha / Vimshottari Dasha Masterclass</li><li>Komilla Sutton · Dasha of Retrograde Planets</li><li>The Astrology Podcast · Transits in Astrology: An Introduction to Timing</li><li>The Ayurvedic Institute · Jyotish and Hasta Samudrika lecture series</li><li>Guest discussions on horoscope matching · YouTube</li><li>Cheiro method walkthrough · YouTube</li><li>Biddy Tarot · Tarot card meanings video training</li></ul>
      <h3>Source-aware use</h3>
      <p>Classical texts survive in different editions, translations, and interpretive lineages. The Bhṛgu Saṃhitā label covers varied manuscript and printed traditions; this report does not claim to access a verified individual Bhṛgu record. Sāmudrika is a separate body-mark/palmistry tradition and is not used as evidence for planetary positions. Video lessons are learning references only; they are not ingested as proof or guaranteed prediction data. Summaries are original paraphrases, not reproduced translations.</p>
      <p><b>Calculation status:</b> planetary positions, divisional charts, and daśā dates are birth-specific and are included as calculated only when a connected ephemeris service returns them. A symbolic chart is not a calculation. Astrological interpretations are traditional beliefs and reflective material, not scientifically established predictions.</p>`;
    report.appendChild(page);
  };
  window.addEventListener('beforeprint', onBeforePrint);
})();
