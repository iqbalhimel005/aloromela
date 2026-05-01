export type { Question, SubjectData, ChapterData, ClassData } from "./exam/types";
import type { ClassData } from "./exam/types";
import { class5Subjects } from "./exam/school-class5";
import { class6Subjects, class7Subjects, class8Subjects } from "./exam/school-class6to8";
import { sscSubjects } from "./exam/school-ssc";
import { hscScienceSubjects } from "./exam/hsc-science";
import { hscArtsSubjects } from "./exam/hsc-arts";
import { hscCommerceSubjects } from "./exam/hsc-commerce";

const banglaEarlyQ = [
  { q: "'অ' থেকে 'ঔ' পর্যন্ত বাংলা স্বরবর্ণ কয়টি?", options: ["৯টি", "১০টি", "১১টি", "১২টি"], answer: 2 },
  { q: "'আম' শব্দে কতটি বর্ণ আছে?", options: ["১টি", "২টি", "৩টি", "৪টি"], answer: 1 },
  { q: "নিচের কোনটি ফলের নাম?", options: ["মাছ", "গরু", "কলা", "বই"], answer: 2 },
  { q: "'মা' শব্দটি কোন বর্ণ দিয়ে শুরু?", options: ["অ", "ম", "ব", "গ"], answer: 1 },
  { q: "কলা কোন ধরনের খাবার?", options: ["সবজি", "ফল", "মাছ", "ডাল"], answer: 1 },
];

const englishEarlyQ = [
  { q: "How many vowels are in English?", options: ["3", "4", "5", "6"], answer: 2 },
  { q: "'A' for ___", options: ["Ball", "Apple", "Cat", "Dog"], answer: 1 },
  { q: "Which one is a color?", options: ["Book", "Red", "Fish", "Cow"], answer: 1 },
  { q: "1 + 1 = ?", options: ["1", "2", "3", "4"], answer: 1 },
  { q: "What comes after Monday?", options: ["Sunday", "Saturday", "Tuesday", "Friday"], answer: 2 },
];

const mathEarlyQ = [
  { q: "২ + ৩ = ?", options: ["৪", "৫", "৬", "৭"], answer: 1 },
  { q: "১০ - ৪ = ?", options: ["৫", "৬", "৭", "৮"], answer: 1 },
  { q: "৩ × ২ = ?", options: ["৪", "৫", "৬", "৭"], answer: 2 },
  { q: "৮ ÷ ২ = ?", options: ["২", "৩", "৪", "৫"], answer: 2 },
  { q: "৫ + ৫ = ?", options: ["৮", "৯", "১০", "১১"], answer: 2 },
];

export const EXAM_CLASSES: ClassData[] = [
  {
    slug: "school-play",
    label: "প্লে",
    subjects: [
      { name: "বাংলা", questions: banglaEarlyQ },
      { name: "ইংরেজি", questions: englishEarlyQ },
      { name: "গণিত", questions: mathEarlyQ },
    ],
  },
  {
    slug: "school-nursery",
    label: "নার্সারি",
    subjects: [
      {
        name: "বাংলা",
        questions: [
          { q: "বাংলায় ব্যঞ্জনবর্ণ কয়টি?", options: ["৩৪টি", "৩৯টি", "৪০টি", "৩৫টি"], answer: 0 },
          { q: "'বাড়ি' শব্দে কয়টি বর্ণ আছে?", options: ["২টি", "৩টি", "৪টি", "৫টি"], answer: 1 },
          { q: "নিচের কোনটি প্রাণীর নাম?", options: ["আম", "বই", "বিড়াল", "ঘর"], answer: 2 },
          { q: "'পানি' শব্দের প্রথম বর্ণ কোনটি?", options: ["ন", "প", "ি", "া"], answer: 1 },
          { q: "'ব' কোন ধরনের বর্ণ?", options: ["স্বরবর্ণ", "ব্যঞ্জনবর্ণ", "সংখ্যা", "কিছুই নয়"], answer: 1 },
        ],
      },
      { name: "ইংরেজি", questions: englishEarlyQ },
      {
        name: "গণিত",
        questions: [
          { q: "৪ + ৬ = ?", options: ["৮", "৯", "১০", "১১"], answer: 2 },
          { q: "১৫ - ৫ = ?", options: ["৮", "৯", "১০", "১১"], answer: 2 },
          { q: "২ × ৫ = ?", options: ["৮", "১০", "১২", "১৪"], answer: 1 },
          { q: "সবচেয়ে ছোট সংখ্যা কোনটি?", options: ["৯", "৫", "১", "০"], answer: 3 },
          { q: "১০ + ১০ = ?", options: ["১৫", "১৮", "২০", "২২"], answer: 2 },
        ],
      },
    ],
  },
  {
    slug: "school-kg1",
    label: "কেজি-১",
    subjects: [
      {
        name: "বাংলা",
        questions: [
          { q: "বাংলা বর্ণমালায় মোট বর্ণ কয়টি?", options: ["৪৮টি", "৪৯টি", "৫০টি", "৫১টি"], answer: 3 },
          { q: "'আকাশ' শব্দে স্বরবর্ণ কয়টি?", options: ["১টি", "২টি", "৩টি", "৪টি"], answer: 1 },
          { q: "নিচের কোন শব্দটি বিশেষ্য?", options: ["সুন্দর", "দৌড়ায়", "আম", "লাল"], answer: 2 },
          { q: "'রবীন্দ্রনাথ' কে ছিলেন?", options: ["বিজ্ঞানী", "কবি", "সৈনিক", "চিকিৎসক"], answer: 1 },
          { q: "বাংলাদেশের জাতীয় সংগীত কে লিখেছেন?", options: ["কাজী নজরুল", "রবীন্দ্রনাথ", "জসীমউদ্দীন", "শামসুর রাহমান"], answer: 1 },
        ],
      },
      {
        name: "ইংরেজি",
        questions: [
          { q: "Which is a noun?", options: ["Run", "Beautiful", "Mango", "Quickly"], answer: 2 },
          { q: "Opposite of 'big' is ___", options: ["Large", "Small", "Tall", "Wide"], answer: 1 },
          { q: "'She ___ a student.' Fill in.", options: ["am", "is", "are", "be"], answer: 1 },
          { q: "How many days in a week?", options: ["5", "6", "7", "8"], answer: 2 },
          { q: "Which is a vowel?", options: ["B", "C", "E", "G"], answer: 2 },
        ],
      },
      {
        name: "গণিত",
        questions: [
          { q: "৭ × ৮ = ?", options: ["৫৪", "৫৬", "৫৮", "৬০"], answer: 1 },
          { q: "৫০ ÷ ৫ = ?", options: ["৮", "৯", "১০", "১১"], answer: 2 },
          { q: "১ ডজন = কয়টি?", options: ["১০টি", "১২টি", "১৪টি", "১৬টি"], answer: 1 },
          { q: "৩² = ?", options: ["৬", "৮", "৯", "১২"], answer: 2 },
          { q: "২৫ + ৩৫ = ?", options: ["৫০", "৫৫", "৬০", "৬৫"], answer: 2 },
        ],
      },
    ],
  },
  {
    slug: "school-kg2",
    label: "কেজি-২",
    subjects: [
      { name: "বাংলা", questions: banglaEarlyQ },
      {
        name: "ইংরেজি",
        questions: [
          { q: "Plural of 'child' is ___", options: ["Childs", "Childes", "Children", "Childrens"], answer: 2 },
          { q: "Which is an adjective?", options: ["Quickly", "Beautiful", "Run", "Book"], answer: 1 },
          { q: "1 year = ___ months", options: ["10", "11", "12", "13"], answer: 2 },
          { q: "'I ___ to school daily.' Fill in.", options: ["goes", "going", "go", "gone"], answer: 2 },
          { q: "Which is correct spelling?", options: ["Skool", "School", "Schol", "Skhool"], answer: 1 },
        ],
      },
      {
        name: "গণিত",
        questions: [
          { q: "১ কিলোমিটার = কত মিটার?", options: ["১০০", "৫০০", "১০০০", "১০"], answer: 2 },
          { q: "৯ × ৯ = ?", options: ["৭২", "৭৮", "৮১", "৮৩"], answer: 2 },
          { q: "বর্গক্ষেত্রের বাহু ৪ সেমি হলে পরিসীমা কত?", options: ["৮", "১২", "১৬", "২০"], answer: 2 },
          { q: "১০০ - ৪৫ = ?", options: ["৫০", "৫৫", "৬০", "৬৫"], answer: 1 },
          { q: "২০ × ৫ = ?", options: ["৮০", "৯০", "১০০", "১১০"], answer: 2 },
        ],
      },
    ],
  },
  {
    slug: "school-class3",
    label: "তৃতীয় শ্রেণি",
    subjects: [
      {
        name: "বাংলা",
        questions: [
          { q: "বিশেষণ কাকে বলে?", options: ["যা ক্রিয়া বোঝায়", "যা বিশেষ্যকে বিশেষিত করে", "যা নাম বোঝায়", "যা স্থান বোঝায়"], answer: 1 },
          { q: "'সূর্য' শব্দের সমার্থক শব্দ কোনটি?", options: ["চাঁদ", "আলো", "রবি", "আকাশ"], answer: 2 },
          { q: "ছড়ার বৈশিষ্ট্য কী?", options: ["ছন্দ ও তাল", "শুধু অর্থ", "দীর্ঘ বর্ণনা", "গদ্য রচনা"], answer: 0 },
          { q: "বাংলাদেশের জাতীয় ফুল কোনটি?", options: ["গোলাপ", "শাপলা", "জুঁই", "কদম"], answer: 1 },
          { q: "বাংলাদেশের জাতীয় পাখি কোনটি?", options: ["ময়না", "দোয়েল", "শালিক", "কোকিল"], answer: 1 },
        ],
      },
      {
        name: "ইংরেজি",
        questions: [
          { q: "Which is a proper noun?", options: ["River", "Dhaka", "City", "Tree"], answer: 1 },
          { q: "Opposite of 'day' is ___", options: ["Morning", "Evening", "Night", "Noon"], answer: 2 },
          { q: "'They ___ playing cricket.' Fill in.", options: ["is", "am", "are", "be"], answer: 2 },
          { q: "How many letters in English alphabet?", options: ["24", "25", "26", "27"], answer: 2 },
          { q: "What is the capital of Bangladesh?", options: ["Chittagong", "Sylhet", "Dhaka", "Rajshahi"], answer: 2 },
        ],
      },
      {
        name: "গণিত",
        questions: [
          { q: "৩৬৫ দিন = কত বছর?", options: ["১", "২", "৩", "৪"], answer: 0 },
          { q: "১২৫ ÷ ৫ = ?", options: ["২০", "২৩", "২৫", "২৭"], answer: 2 },
          { q: "ত্রিভুজের তিন বাহু যোগ করলে কী পাওয়া যায়?", options: ["ক্ষেত্রফল", "পরিসীমা", "কোণ", "উচ্চতা"], answer: 1 },
          { q: "৭৫ + ২৫ = ?", options: ["৯০", "৯৫", "১০০", "১০৫"], answer: 2 },
          { q: "১ ঘণ্টা = কত মিনিট?", options: ["৫০", "৫৫", "৬০", "৬৫"], answer: 2 },
        ],
      },
      {
        name: "পরিবেশ পরিচিতি বিজ্ঞান",
        questions: [
          { q: "উদ্ভিদ খাবার তৈরিতে কোনটি ব্যবহার করে?", options: ["অক্সিজেন", "সূর্যালোক", "চিনি", "পানি শুধু"], answer: 1 },
          { q: "পানির স্বাভাবিক অবস্থা কী?", options: ["কঠিন", "তরল", "বায়বীয়", "কোনটিই নয়"], answer: 1 },
          { q: "আমরা শ্বাস নিই কোনটি?", options: ["কার্বন ডাই-অক্সাইড", "নাইট্রোজেন", "অক্সিজেন", "হাইড্রোজেন"], answer: 2 },
          { q: "সূর্য কোন দিকে ওঠে?", options: ["পশ্চিম", "উত্তর", "পূর্ব", "দক্ষিণ"], answer: 2 },
          { q: "মানুষের দাঁত কিসে সাহায্য করে?", options: ["হাঁটতে", "দেখতে", "খাবার চিবাতে", "শুনতে"], answer: 2 },
        ],
      },
      {
        name: "সমাজ পরিচিতি",
        questions: [
          { q: "বাংলাদেশের রাজধানী কোনটি?", options: ["চট্টগ্রাম", "ঢাকা", "সিলেট", "রাজশাহী"], answer: 1 },
          { q: "আমাদের জাতীয় পাখি কোনটি?", options: ["ময়না", "দোয়েল", "শালিক", "কোকিল"], answer: 1 },
          { q: "বাংলাদেশের স্বাধীনতা দিবস কবে?", options: ["১৬ ডিসেম্বর", "২৬ মার্চ", "২১ ফেব্রুয়ারি", "১৫ আগস্ট"], answer: 1 },
          { q: "বঙ্গবন্ধু শেখ মুজিবুর রহমান কে ছিলেন?", options: ["কবি", "বিজ্ঞানী", "জাতির পিতা", "চিকিৎসক"], answer: 2 },
          { q: "বাংলাদেশে মোট জেলা কতটি?", options: ["৬০টি", "৬৪টি", "৬৮টি", "৭০টি"], answer: 1 },
        ],
      },
    ],
  },
  {
    slug: "school-class4",
    label: "চতুর্থ শ্রেণি",
    subjects: [
      {
        name: "বাংলা",
        questions: [
          { q: "ক্রিয়া বিশেষণ কাকে বলে?", options: ["বিশেষ্যকে বিশেষিত করে", "ক্রিয়াকে বিশেষিত করে", "নাম বোঝায়", "সর্বনামকে বোঝায়"], answer: 1 },
          { q: "সন্ধি কত প্রকার?", options: ["২ প্রকার", "৩ প্রকার", "৪ প্রকার", "৫ প্রকার"], answer: 1 },
          { q: "'আকাশ' শব্দের বিপরীত শব্দ কোনটি?", options: ["মাটি", "পাতাল", "পানি", "বাতাস"], answer: 1 },
          { q: "বাংলাদেশের জাতীয় ফল কোনটি?", options: ["আম", "কাঁঠাল", "লিচু", "কলা"], answer: 1 },
          { q: "বাংলা সাহিত্যের আদি নিদর্শন কোনটি?", options: ["মনসামঙ্গল", "চর্যাপদ", "গীতিকা", "বৈষ্ণব পদাবলি"], answer: 1 },
        ],
      },
      {
        name: "ইংরেজি",
        questions: [
          { q: "Which tense: 'She goes to school.'", options: ["Past", "Present", "Future", "Perfect"], answer: 1 },
          { q: "Antonym of 'hot' is ___", options: ["Warm", "Cool", "Cold", "Mild"], answer: 2 },
          { q: "Singular of 'teeth' is ___", options: ["Teeths", "Tooth", "Tooths", "Teet"], answer: 1 },
          { q: "'___ do you live?' 'In Dhaka.'", options: ["What", "Who", "Where", "When"], answer: 2 },
          { q: "Which is a conjunction?", options: ["Quickly", "And", "Beautiful", "Run"], answer: 1 },
        ],
      },
      {
        name: "গণিত",
        questions: [
          { q: "১ মিটার = কত সেন্টিমিটার?", options: ["১০", "৫০", "১০০", "১০০০"], answer: 2 },
          { q: "৪ × ৪ × ৪ = ?", options: ["৪৮", "৫৬", "৬৪", "৭২"], answer: 2 },
          { q: "ক্ষেত্রফল = দৈর্ঘ্য × ?", options: ["উচ্চতা", "প্রস্থ", "পরিসীমা", "কোণ"], answer: 1 },
          { q: "১৪৪ ÷ ১২ = ?", options: ["১০", "১১", "১২", "১৩"], answer: 2 },
          { q: "৩/৪ ভগ্নাংশের লব কত?", options: ["৩", "৪", "৭", "১২"], answer: 0 },
        ],
      },
      {
        name: "পরিবেশ পরিচিতি বিজ্ঞান",
        questions: [
          { q: "পানির রাসায়নিক সংকেত কোনটি?", options: ["CO₂", "O₂", "H₂O", "NaCl"], answer: 2 },
          { q: "বায়ুতে সবচেয়ে বেশি কোন গ্যাস আছে?", options: ["অক্সিজেন", "কার্বন ডাই-অক্সাইড", "নাইট্রোজেন", "হাইড্রোজেন"], answer: 2 },
          { q: "কোনটি তৃণভোজী প্রাণী?", options: ["বাঘ", "সিংহ", "গরু", "কুমির"], answer: 2 },
          { q: "পৃথিবী সূর্যের চারদিকে ঘুরতে কতদিন লাগে?", options: ["৩০ দিন", "২৬৫ দিন", "৩৬৫ দিন", "৩৬৬ দিন"], answer: 2 },
          { q: "মানবদেহে কতটি হাড় আছে?", options: ["১৯৬টি", "২০০টি", "২০৬টি", "২১০টি"], answer: 2 },
        ],
      },
      {
        name: "সমাজ পরিচিতি",
        questions: [
          { q: "ভাষা আন্দোলন কত সালে হয়?", options: ["১৯৫০", "১৯৫২", "১৯৫৪", "১৯৫৬"], answer: 1 },
          { q: "পদ্মা সেতু কত কিলোমিটার দীর্ঘ?", options: ["৫.৫", "৬.১৫", "৭.০", "৪.৮"], answer: 1 },
          { q: "বাংলাদেশের প্রথম রাষ্ট্রপতি কে ছিলেন?", options: ["বঙ্গবন্ধু শেখ মুজিবুর রহমান", "জিয়াউর রহমান", "সৈয়দ নজরুল ইসলাম", "তাজউদ্দীন আহমদ"], answer: 0 },
          { q: "বাংলাদেশের জাতীয় গাছ কোনটি?", options: ["আম গাছ", "শাল গাছ", "বটগাছ", "তাল গাছ"], answer: 2 },
          { q: "সুন্দরবন কোথায় অবস্থিত?", options: ["ময়মনসিংহ", "রাজশাহী", "খুলনা", "সিলেট"], answer: 2 },
        ],
      },
    ],
  },

  // ======================== ক্লাস ৫-১০ (অধ্যায়ভিত্তিক) ========================
  { slug: "school-class5", label: "পঞ্চম শ্রেণি", subjects: class5Subjects },
  { slug: "school-class6", label: "ষষ্ঠ শ্রেণি", subjects: class6Subjects },
  { slug: "school-class7", label: "সপ্তম শ্রেণি", subjects: class7Subjects },
  { slug: "school-class8", label: "অষ্টম শ্রেণি", subjects: class8Subjects },
  { slug: "school-class9to10", label: "নবম-দশম শ্রেণি (SSC)", subjects: sscSubjects },

  // ======================== একাদশ-দ্বাদশ (HSC) — অধ্যায়ভিত্তিক ========================
  { slug: "college-science", label: "একাদশ-দ্বাদশ (বিজ্ঞান)", subjects: hscScienceSubjects },
  { slug: "college-arts", label: "একাদশ-দ্বাদশ (মানবিক)", subjects: hscArtsSubjects },
  { slug: "college-commerce", label: "একাদশ-দ্বাদশ (বাণিজ্য)", subjects: hscCommerceSubjects },
];
