export const SCHOOL_CLASSES = [
  { slug: "school-play",    label: "প্লে" },
  { slug: "school-nursery", label: "নার্সারি" },
  { slug: "school-kg1",     label: "কেজি ওয়ান" },
  { slug: "school-kg2",     label: "কেজি টু" },
  { slug: "school-class3",  label: "তৃতীয় শ্রেণি" },
  { slug: "school-class4",  label: "চতুর্থ শ্রেণি" },
  { slug: "school-class5",  label: "পঞ্চম শ্রেণি" },
  { slug: "school-class6",  label: "ষষ্ঠ শ্রেণি" },
  { slug: "school-class7",  label: "সপ্তম শ্রেণি" },
  { slug: "school-class8",  label: "অষ্টম শ্রেণি" },
  { slug: "school-class9",  label: "নবম শ্রেণি" },
  { slug: "school-class10", label: "দশম শ্রেণি" },
];

export const COLLEGE_GROUPS = [
  { slug: "college-science",  label: "বিজ্ঞান" },
  { slug: "college-arts",     label: "মানবিক" },
  { slug: "college-commerce", label: "ব্যবসায় শিক্ষা" },
];

export const DEGREE_YEARS = [
  { slug: "degree-year1", label: "প্রথম বর্ষ" },
  { slug: "degree-year2", label: "দ্বিতীয় বর্ষ" },
  { slug: "degree-year3", label: "তৃতীয় বর্ষ" },
];

export const HONOURS_SUBJECTS = [
  { slug: "physics",           label: "পদার্থবিজ্ঞান" },
  { slug: "chemistry",         label: "রসায়ন" },
  { slug: "math",              label: "গণিত" },
  { slug: "zoology",           label: "প্রাণিবিজ্ঞান (জুওলজি)" },
  { slug: "botany",            label: "উদ্ভিদবিজ্ঞান (বোটানি)" },
  { slug: "history",           label: "ইতিহাস" },
  { slug: "islamic-history",   label: "ইসলামের ইতিহাস" },
  { slug: "social-welfare",    label: "সমাজ কল্যাণ" },
  { slug: "geography",         label: "ভূগোল" },
  { slug: "accounting",        label: "হিসাববিজ্ঞান" },
  { slug: "economics",         label: "অর্থনীতি" },
  { slug: "management",        label: "ব্যবস্থাপনা" },
  { slug: "philosophy",        label: "দর্শন" },
  { slug: "political-science", label: "রাজনীতি বিজ্ঞান" },
  { slug: "bengali",           label: "বাংলা" },
  { slug: "english",           label: "ইংরেজি" },
];

export const HONOURS_YEARS = [
  { suffix: "year1", label: "অনার্স ১ম বর্ষ" },
  { suffix: "year2", label: "অনার্স ২য় বর্ষ" },
  { suffix: "year3", label: "অনার্স ৩য় বর্ষ" },
  { suffix: "year4", label: "অনার্স ৪র্থ বর্ষ" },
  { suffix: "masters-preli",   label: "প্রিলি মাস্টার্স" },
  { suffix: "masters-honours", label: "অনার্স মাস্টার্স" },
];

export function getHonoursSlug(subjectSlug: string, suffix: string): string {
  return `honours-${subjectSlug}-${suffix}`;
}

export const ALL_CATEGORIES = [
  { id: "all",        label: "সব বই" },
  ...SCHOOL_CLASSES,
  ...COLLEGE_GROUPS,
  ...DEGREE_YEARS,
  ...HONOURS_SUBJECTS.flatMap(s =>
    HONOURS_YEARS.map(y => ({
      slug: getHonoursSlug(s.slug, y.suffix),
      label: `${s.label} - ${y.label}`,
    }))
  ),
  { slug: "job",        label: "চাকরি" },
  { slug: "novel",      label: "উপন্যাস" },
  { slug: "story-poem", label: "গল্প কবিতা" },
  { slug: "pdf",        label: "পিডিএফ" },
];

export function getCategoryLabel(slug: string): string {
  if (slug === "all") return "সব বই";
  const all = ALL_CATEGORIES.find(c => "slug" in c && c.slug === slug);
  return all && "label" in all ? all.label : slug;
}
