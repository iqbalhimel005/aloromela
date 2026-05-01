export type Question = {
  q: string;
  options: string[];
  answer: number;
};

export type ChapterData = {
  name: string;
  questions: Question[];
};

export type SubjectData = {
  name: string;
  questions?: Question[];
  chapters?: ChapterData[];
};

export type ClassData = {
  slug: string;
  label: string;
  subjects: SubjectData[];
};
