export class TranslatorConstants {
  static readonly MODELS: Record<string, number> = {
    // Original checkpoints
    'onnx-community/whisper-tiny': 120, // 33 + 87
    'onnx-community/whisper-base': 206, // 83 + 123
    'onnx-community/whisper-small': 586, // 353 + 233
    'onnx-community/whisper-large-v3-turbo': 1604, // 1270 + 334

    // Distil Whisper (English-only)
    'onnx-community/distil-small.en': 538, // 353 + 185
  };

  // List of supported languages:
  // https://help.openai.com/en/articles/7031512-whisper-api-faq
  // https://github.com/openai/whisper/blob/248b6cb124225dd263bb9bd32d060b6517e067f8/whisper/tokenizer.py#L79
  static readonly SUPPORTED_LANGUAGES = {
    en: 'english',
    zh: 'chinese',
    de: 'german',
    es: 'spanish/castilian',
    ru: 'russian',
    ko: 'korean',
    fr: 'french',
    ja: 'japanese',
    pt: 'portuguese',
    tr: 'turkish',
    pl: 'polish',
    ca: 'catalan/valencian',
    nl: 'dutch/flemish',
    ar: 'arabic',
    sv: 'swedish',
    it: 'italian',
    id: 'indonesian',
    hi: 'hindi',
    fi: 'finnish',
    vi: 'vietnamese',
    he: 'hebrew',
    uk: 'ukrainian',
    el: 'greek',
    ms: 'malay',
    cs: 'czech',
    ro: 'romanian/moldavian/moldovan',
    da: 'danish',
    hu: 'hungarian',
    ta: 'tamil',
    no: 'norwegian',
    th: 'thai',
    ur: 'urdu',
    hr: 'croatian',
    bg: 'bulgarian',
    lt: 'lithuanian',
    la: 'latin',
    mi: 'maori',
    ml: 'malayalam',
    cy: 'welsh',
    sk: 'slovak',
    te: 'telugu',
    fa: 'persian',
    lv: 'latvian',
    bn: 'bengali',
    sr: 'serbian',
    az: 'azerbaijani',
    sl: 'slovenian',
    kn: 'kannada',
    et: 'estonian',
    mk: 'macedonian',
    br: 'breton',
    eu: 'basque',
    is: 'icelandic',
    hy: 'armenian',
    ne: 'nepali',
    mn: 'mongolian',
    bs: 'bosnian',
    kk: 'kazakh',
    sq: 'albanian',
    sw: 'swahili',
    gl: 'galician',
    mr: 'marathi',
    pa: 'punjabi/panjabi',
    si: 'sinhala/sinhalese',
    km: 'khmer',
    sn: 'shona',
    yo: 'yoruba',
    so: 'somali',
    af: 'afrikaans',
    oc: 'occitan',
    ka: 'georgian',
    be: 'belarusian',
    tg: 'tajik',
    sd: 'sindhi',
    gu: 'gujarati',
    am: 'amharic',
    yi: 'yiddish',
    lo: 'lao',
    uz: 'uzbek',
    fo: 'faroese',
    ht: 'haitian creole/haitian',
    ps: 'pashto/pushto',
    tk: 'turkmen',
    nn: 'nynorsk',
    mt: 'maltese',
    sa: 'sanskrit',
    lb: 'luxembourgish/letzeburgesch',
    my: 'myanmar/burmese',
    bo: 'tibetan',
    tl: 'tagalog',
    mg: 'malagasy',
    as: 'assamese',
    tt: 'tatar',
    haw: 'hawaiian',
    ln: 'lingala',
    ha: 'hausa',
    ba: 'bashkir',
    jw: 'javanese',
    su: 'sundanese',
  };
}
