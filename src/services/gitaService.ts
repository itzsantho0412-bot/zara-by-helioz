// Source texts are standard Bhagavad Gita verses (Sanskrit transliteration).
// The Tamil and English meanings and practical notes below are generated commentary, not scripture.
export interface GitaVerse {
  ref: string;
  sanskrit: string;
  transliteration: string;
  sourceNote: string;
  englishMeaning: string;
  tamilMeaning: string;
  practical: string;
  example: string;
}

export const GITA_VERSES: GitaVerse[] = [
  {
    ref: 'Chapter 2, Verse 47',
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    transliteration: 'karmaṇy evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo ’stv akarmaṇi',
    sourceNote: 'Source text: Bhagavad Gita 2.47',
    englishMeaning: 'You have a right to your actions, but never to their fruits. Do not let the results be your sole motive, and do not cling to inaction.',
    tamilMeaning: 'உன் கடமையைச் செய்வதில் மட்டுமே உனக்கு உரிமை உண்டு; அதன் பலன்களில் அல்ல. பலனே உன் நோக்கமாக இருக்கக்கூடாது; செயலற்று இருப்பதிலும் பற்று வைக்காதே.',
    practical: 'Focus on the quality of your effort, not only the result. Exam marks and business sales will follow effort, but anxiety about them steals today’s focus.',
    example: 'Before a test, study the topics in front of you with full attention instead of replaying “what if I fail?” all night.',
  },
  {
    ref: 'Chapter 2, Verse 14',
    sanskrit: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः। आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥',
    transliteration: 'mātrā-sparśās tu kaunteya śītoṣṇa-sukha-duḥkha-dāḥ | āgamāpāyino ’nityās tāṁs titikṣasva bhārata',
    sourceNote: 'Source text: Bhagavad Gita 2.14',
    englishMeaning: 'Contacts of the senses bring heat and cold, pleasure and pain. They come and go and are impermanent; learn to endure them calmly.',
    tamilMeaning: 'புலன்களின் தொடர்பால் குளிர், வெப்பம், இன்பம், துன்பம் வருகின்றன. அவை வந்து போகும், நிலையற்றவை; அவற்றை அமைதியாகத் தாங்கிக்கொள்.',
    practical: 'Bad days, a low sales week, or a tired body pass. Stay steady through them rather than reacting to each wave.',
    example: 'If a T-shirt order gets cancelled, note the lesson, reply calmly to the customer, and move on to the next order.',
  },
  {
    ref: 'Chapter 3, Verse 19',
    sanskrit: 'तस्मादसक्तः सततं कार्यं कर्म समाचर। असक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः॥',
    transliteration: 'tasmād asaktaḥ satataṁ kāryaṁ karma samācara | asakto hy ācaran karma param āpnoti pūruṣaḥ',
    sourceNote: 'Source text: Bhagavad Gita 3.19',
    englishMeaning: 'Therefore, always perform your duty without attachment. By working without attachment, a person attains the highest.',
    tamilMeaning: 'ஆகையால், பற்றின்றி எப்போதும் உன் கடமையைச் செய். பற்றின்றிச் செயலாற்றும் மனிதன் உயர்ந்த நிலையை அடைகிறான்.',
    practical: 'Consistency beats bursts of motivation. A steady hour of gym, study, or business work each day builds the discipline you need.',
    example: 'Go to the gym on a Tuesday even when you do not feel like it. The habit matters more than one perfect session.',
  },
];

export const dailyVerse = (date = new Date()) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return GITA_VERSES[day % GITA_VERSES.length];
};

export const QUOTES = [
  'Small steps every day lead to big changes.',
  'Discipline today, freedom tomorrow.',
  'Progress is better than perfection.',
  'Your better mind, bigger goals, greater you.',
];
