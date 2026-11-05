// Rule-based Gaelic -> approximate English-readable phonetic respelling.
//
// Purpose: browser speechSynthesis has no real Gaelic voice, so it reads Gaelic
// spelling with English letter-to-sound rules, which is badly wrong (e.g. 'mh'
// read as 'm'+'h' instead of 'v', 'bh' the same, 'fh' read aloud instead of
// silent). This rewrites the text into a respelling that an English voice will
// read closer to the real Gaelic sound, based on the core rules documented in
// data/pronunciation.json (sourced from Blas na Gàidhlig's sound explanations,
// paraphrased — see TODO.md section 3).
//
// This is a heuristic approximation, not a substitute for real audio or a
// human pronunciation guide — broad/slender vowel quality and genuine Gaelic
// vowel sounds are NOT modelled, only consonant mutations and a few vowel-length
// and diphthong hints that matter most for intelligibility from an English voice.
const GaelicPhonetic = (() => {
  function toApprox(text) {
    let s = text;

    // 'sg' before e/i (sgìth, sgeul, Sgitheanach...) is genuinely pronounced like English
    // 'sk' in this position — handle it before the generic g-hardening below, because
    // inserting a 'u' after 'sg' (the generic fix) risks an English voice adding a spurious
    // 'w'-like glide ('sgw...'), where plain 'sk' is unambiguous and has no such risk.
    s = s.replace(/sg(?=[eiìéè])/gi, m => (m[0] === 'S' ? 'Sk' : 'sk'));

    // English reads plain 'c'/'g' as soft (s/j) before e or i (city, gem) — Gaelic 'c'/'g'
    // is always hard (k/g) regardless of the following vowel, so force the hard reading an
    // English voice will actually use. Must run on the ORIGINAL plain e/i letters, before the
    // accented-vowel step below turns è/ì into digraphs containing a literal 'e' — otherwise
    // this would misfire on words like 'sgìth' (the 'g' there isn't followed by a real e/i).
    s = s.replace(/c(?=[eiìéè])/g, 'k');
    s = s.replace(/C(?=[eiìéè])/g, 'K');
    s = s.replace(/g(?=[eiìéè])/g, 'gu');
    s = s.replace(/G(?=[eiìéè])/g, 'Gu');

    // Long vowels (grave/acute accents): hint length/quality with English-readable digraphs.
    // Do this before consonant-digraph steps so inserted letters can't collide with them.
    s = s.replace(/à/gi, m => (m === 'À' ? 'AA' : 'aa'));
    s = s.replace(/á/gi, m => (m === 'Á' ? 'AA' : 'aa'));
    s = s.replace(/ò/gi, m => (m === 'Ò' ? 'OH' : 'oh'));
    s = s.replace(/ó/gi, m => (m === 'Ó' ? 'OH' : 'oh'));
    s = s.replace(/ù/gi, m => (m === 'Ù' ? 'OO' : 'oo'));
    s = s.replace(/ì/gi, m => (m === 'Ì' ? 'EE' : 'ee'));
    s = s.replace(/é/gi, m => (m === 'É' ? 'AY' : 'ay'));
    s = s.replace(/è/gi, m => (m === 'È' ? 'EH' : 'eh'));

    // Common diphthong-ish spellings that mislead an English reader.
    s = s.replace(/eu/gi, 'ay');
    s = s.replace(/ao/gi, 'eu');

    // Lenited consonants: these are real sound changes, not silent h's.
    s = s.replace(/ph/gi, m => (m[0] === 'P' ? 'F' : 'f'));
    s = s.replace(/bh/gi, m => (m[0] === 'B' ? 'V' : 'v'));
    s = s.replace(/mh/gi, m => (m[0] === 'M' ? 'V' : 'v'));
    // dh/gh: silent-ish at the end of a word, a soft glide elsewhere.
    s = s.replace(/[dg]h\b/gi, '');
    s = s.replace(/[dg]h/gi, 'y');
    s = s.replace(/ch/gi, 'kh');
    s = s.replace(/sh/gi, 'h');
    s = s.replace(/th/gi, 'h');
    // fh is silent almost everywhere.
    s = s.replace(/fh/gi, '');

    // Pre-aspiration: Gaelic puts a puff of air BEFORE c/p/t in the middle or
    // end of a word, not after like English — approximate with an inserted 'h'.
    s = s.replace(/([aeiouAEIOU])(c|p|t)\b/g, '$1h$2');
    s = s.replace(/([aeiouAEIOU])(c|p|t)([bcdfgjklmnpqrstvwxz])/g, '$1h$2$3');

    return s;
  }

  return { toApprox };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GaelicPhonetic;
}
