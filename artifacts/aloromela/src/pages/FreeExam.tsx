import { useState } from "react";
import { BookOpen, CheckCircle2, ChevronRight, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { EXAM_CLASSES, ClassData, SubjectData, ChapterData } from "@/data/examQuestions";

type Step = "select-class" | "select-subject" | "select-chapter" | "register" | "exam" | "result";

type StudentInfo = {
  name: string;
  institution: string;
  address: string;
  mobile: string;
};

const STEPS = [
  { key: "select-class", label: "শ্রেণি" },
  { key: "select-subject", label: "বিষয়" },
  { key: "select-chapter", label: "অধ্যায়" },
  { key: "register", label: "নিবন্ধন" },
  { key: "exam", label: "পরীক্ষা" },
  { key: "result", label: "ফলাফল" },
] as const;

const SCHOOL = EXAM_CLASSES.filter(c => c.slug.startsWith("school-"));
const COLLEGE = EXAM_CLASSES.filter(c => c.slug.startsWith("college-"));

function getSubjectQuestionCount(sub: SubjectData): number {
  if (sub.chapters && sub.chapters.length > 0) {
    return sub.chapters.reduce((sum, ch) => sum + ch.questions.length, 0);
  }
  return sub.questions?.length ?? 0;
}

function getSubjectChapterCount(sub: SubjectData): number | null {
  if (sub.chapters && sub.chapters.length > 0) return sub.chapters.length;
  return null;
}

export function FreeExam() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("select-class");
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectData | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterData | null>(null);
  const [student, setStudent] = useState<StudentInfo>({ name: "", institution: "", address: "", mobile: "" });
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const activeQuestions = selectedChapter
    ? selectedChapter.questions
    : (selectedSubject?.questions ?? []);

  const handleClassSelect = (cls: ClassData) => {
    setSelectedClass(cls);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setStep("select-subject");
  };

  const handleSubjectSelect = (sub: SubjectData) => {
    setSelectedSubject(sub);
    setSelectedChapter(null);
    if (sub.chapters && sub.chapters.length > 0) {
      setStep("select-chapter");
    } else {
      setAnswers(new Array(sub.questions?.length ?? 0).fill(null));
      setStep("register");
    }
  };

  const handleChapterSelect = (ch: ChapterData) => {
    setSelectedChapter(ch);
    setAnswers(new Array(ch.questions.length).fill(null));
    setStep("register");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student.name.trim() || !student.institution.trim() || !student.address.trim() || !student.mobile.trim()) {
      toast({ title: "সব তথ্য পূরণ করুন", variant: "destructive" });
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(student.mobile.replace(/\s/g, ""))) {
      toast({ title: "সঠিক মোবাইল নম্বর দিন", variant: "destructive" });
      return;
    }
    setStep("exam");
  };

  const handleAnswer = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    const updated = [...answers];
    updated[qIdx] = optIdx;
    setAnswers(updated);
  };

  const handleSubmitExam = () => {
    if (answers.includes(null)) {
      toast({ title: "সব প্রশ্নের উত্তর দিন", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    setStep("result");
  };

  const score = answers.filter((a, i) => a === activeQuestions[i]?.answer).length;
  const total = activeQuestions.length;

  const handleRestart = () => {
    setStep("select-class");
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setStudent({ name: "", institution: "", address: "", mobile: "" });
    setAnswers([]);
    setSubmitted(false);
  };

  const currentStepIdx = STEPS.findIndex(s => s.key === step);

  const visibleSteps = STEPS.filter(s => {
    if (s.key === "select-chapter") {
      return selectedSubject?.chapters && selectedSubject.chapters.length > 0;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 50%, white 0%, transparent 50%)"
        }} />
        <div className="relative z-10">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">ফ্রি পরীক্ষা প্রস্তুতি</h1>
          <p className="text-primary-foreground/80 text-lg">অনলাইনে MCQ পরীক্ষা দিন, নিজেকে যাচাই করুন</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-center gap-1 mb-8 text-sm flex-wrap">
          {visibleSteps.map((s, idx) => {
            const isDone = currentStepIdx > STEPS.findIndex(x => x.key === s.key);
            const isActive = s.key === step;
            return (
              <div key={s.key} className="flex items-center gap-1">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" :
                  isDone ? "bg-primary/20 text-primary" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{idx + 1}</span>}
                  {s.label}
                </div>
                {idx < visibleSteps.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              </div>
            );
          })}
        </div>

        {/* ─── Step 1: শ্রেণি নির্বাচন ─── */}
        {step === "select-class" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-1">স্কুল শ্রেণি</h2>
              <p className="text-sm text-muted-foreground mb-3">প্লে থেকে দশম শ্রেণি</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {SCHOOL.map(cls => (
                  <button
                    key={cls.slug}
                    onClick={() => handleClassSelect(cls)}
                    className="p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 text-center font-semibold transition-all cursor-pointer"
                  >
                    {cls.label}
                    <div className="text-xs text-muted-foreground mt-1 font-normal">{cls.subjects.length}টি বিষয়</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">কলেজ বিভাগ</h2>
              <p className="text-sm text-muted-foreground mb-3">বিজ্ঞান, মানবিক ও বাণিজ্য</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {COLLEGE.map(cls => (
                  <button
                    key={cls.slug}
                    onClick={() => handleClassSelect(cls)}
                    className="p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 text-center font-semibold transition-all cursor-pointer"
                  >
                    {cls.label}
                    <div className="text-xs text-muted-foreground mt-1 font-normal">{cls.subjects.length}টি বিষয়</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 2: বিষয় নির্বাচন ─── */}
        {step === "select-subject" && selectedClass && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep("select-class")} className="text-sm text-primary underline">← পেছনে</button>
              <div>
                <h2 className="text-xl font-bold">{selectedClass.label} — বিষয় নির্বাচন করুন</h2>
                <p className="text-sm text-muted-foreground">কোন বিষয়ে পরীক্ষা দিতে চান?</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {selectedClass.subjects.map(sub => {
                const chapterCount = getSubjectChapterCount(sub);
                const qCount = getSubjectQuestionCount(sub);
                return (
                  <button
                    key={sub.name}
                    onClick={() => handleSubjectSelect(sub)}
                    className="p-5 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 text-center font-semibold transition-all cursor-pointer group"
                  >
                    <div className="text-2xl mb-2">{getSubjectIcon(sub.name)}</div>
                    {sub.name}
                    {chapterCount !== null ? (
                      <div className="text-xs text-muted-foreground mt-1 font-normal">{chapterCount}টি অধ্যায় · {qCount}টি প্রশ্ন</div>
                    ) : (
                      <div className="text-xs text-muted-foreground mt-1 font-normal">{qCount}টি প্রশ্ন</div>
                    )}
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-primary font-medium">
                      শুরু করুন →
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Step 3: অধ্যায় নির্বাচন ─── */}
        {step === "select-chapter" && selectedClass && selectedSubject && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep("select-subject")} className="text-sm text-primary underline">← পেছনে</button>
              <div>
                <h2 className="text-xl font-bold">{selectedSubject.name} — অধ্যায় নির্বাচন করুন</h2>
                <p className="text-sm text-muted-foreground">কোন অধ্যায়ের পরীক্ষা দিতে চান?</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedSubject.chapters?.map((ch, idx) => (
                <button
                  key={ch.name}
                  onClick={() => handleChapterSelect(ch)}
                  className="p-5 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 text-left font-semibold transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs text-primary font-medium mb-1">অধ্যায় {idx + 1}</div>
                      <div className="text-sm leading-snug">{ch.name}</div>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">{ch.questions.length}টি MCQ</Badge>
                  </div>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-primary font-medium">
                    পরীক্ষা দিন →
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── Step 4: নিবন্ধন ফর্ম ─── */}
        {step === "register" && selectedClass && selectedSubject && (
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="text-center">
                শিক্ষার্থী নিবন্ধন
              </CardTitle>
              <div className="flex justify-center gap-2 flex-wrap">
                <Badge className="bg-primary/10 text-primary border-none">{selectedClass.label}</Badge>
                <Badge className="bg-emerald-100 text-emerald-700 border-none">{selectedSubject.name}</Badge>
                {selectedChapter && (
                  <Badge className="bg-blue-100 text-blue-700 border-none">{selectedChapter.name}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">নাম <span className="text-destructive">*</span></Label>
                  <Input
                    id="name"
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    value={student.name}
                    onChange={e => setStudent(s => ({ ...s, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="institution">প্রতিষ্ঠানের নাম <span className="text-destructive">*</span></Label>
                  <Input
                    id="institution"
                    placeholder="বিদ্যালয় / কলেজের নাম"
                    value={student.institution}
                    onChange={e => setStudent(s => ({ ...s, institution: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address">ঠিকানা <span className="text/destructive">*</span></Label>
                  <Input
                    id="address"
                    placeholder="গ্রাম / শহর, উপজেলা, জেলা"
                    value={student.address}
                    onChange={e => setStudent(s => ({ ...s, address: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="mobile">মোবাইল নম্বর <span className="text-destructive">*</span></Label>
                  <Input
                    id="mobile"
                    placeholder="01XXXXXXXXX"
                    value={student.mobile}
                    onChange={e => setStudent(s => ({ ...s, mobile: e.target.value }))}
                    maxLength={11}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => {
                    if (selectedSubject?.chapters?.length) {
                      setStep("select-chapter");
                    } else {
                      setStep("select-subject");
                    }
                  }}>
                    পেছনে
                  </Button>
                  <Button type="submit" className="flex-1">
                    পরীক্ষা শুরু করুন <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ─── Step 5: MCQ পরীক্ষা ─── */}
        {step === "exam" && selectedClass && selectedSubject && (
          <div className="space-y-5">
            <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedClass.label} — {selectedSubject.name}
                  {selectedChapter && <span className="text-base font-medium text-muted-foreground"> ({selectedChapter.name})</span>}
                </h2>
                <p className="text-sm text-muted-foreground">
                  পরীক্ষার্থী: {student.name} | {student.institution}
                </p>
              </div>
              <Badge variant="outline" className="text-sm">
                {answers.filter(a => a !== null).length}/{total} উত্তর
              </Badge>
            </div>

            {activeQuestions.map((q, qIdx) => (
              <Card key={qIdx} className={`transition-all ${answers[qIdx] !== null ? "border-primary/40" : ""}`}>
                <CardContent className="pt-5">
                  <p className="font-semibold mb-4 leading-relaxed">
                    <span className="text-primary font-bold mr-2">{qIdx + 1}.</span>
                    {q.q}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswer(qIdx, oIdx)}
                        className={`text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${
                          answers[qIdx] === oIdx
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/40 hover:bg-accent"
                        }`}
                      >
                        <span className="font-bold mr-2 text-primary/70">
                          {["ক", "খ", "গ", "ঘ"][oIdx]}.
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button size="lg" className="w-full text-lg py-6" onClick={handleSubmitExam}>
              পরীক্ষা জমা দিন <CheckCircle2 className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {/* ─── Step 6: ফলাফল ─── */}
        {step === "result" && selectedClass && selectedSubject && (
          <div className="space-y-6">
            <Card className="text-center border-2 border-primary/30">
              <CardContent className="pt-8 pb-6">
                <Trophy className={`w-16 h-16 mx-auto mb-4 ${score >= total * 0.8 ? "text-yellow-500" : score >= total * 0.5 ? "text-primary" : "text-muted-foreground"}`} />
                <h2 className="text-2xl font-bold mb-1">পরীক্ষার ফলাফল</h2>
                <p className="text-muted-foreground mb-1">{student.name} | {student.institution}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedClass.label} — {selectedSubject.name}
                  {selectedChapter && ` — ${selectedChapter.name}`}
                </p>
                <div className="text-6xl font-bold text-primary mb-2">{score}/{total}</div>
                <div className="text-lg font-medium text-muted-foreground mb-4">
                  ({Math.round((score / total) * 100)}%)
                </div>
                <Badge className={`text-base px-4 py-1.5 border ${
                  score >= total * 0.8 ? "bg-green-100 text-green-700 border-green-300" :
                  score >= total * 0.5 ? "bg-blue-100 text-blue-700 border-blue-300" :
                  "bg-red-100 text-red-700 border-red-300"
                }`}>
                  {score >= total * 0.8 ? "চমৎকার! অসাধারণ ফলাফল" :
                   score >= total * 0.5 ? "ভালো! আরো চর্চা করুন" :
                   "আরো মনোযোগ দিয়ে পড়ুন"}
                </Badge>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">সঠিক উত্তর দেখুন</h3>
              {activeQuestions.map((q, qIdx) => {
                const userAnswer = answers[qIdx];
                const correct = q.answer;
                const isCorrect = userAnswer === correct;
                return (
                  <Card key={qIdx} className={`border-2 ${isCorrect ? "border-green-300 bg-green-50/50" : "border-red-300 bg-red-50/50"}`}>
                    <CardContent className="pt-4 pb-4">
                      <p className="font-semibold mb-3 text-sm leading-relaxed">
                        <span className="font-bold mr-1">{qIdx + 1}.</span>{q.q}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                              oIdx === correct
                                ? "border-green-500 bg-green-100 text-green-800"
                                : oIdx === userAnswer && !isCorrect
                                ? "border-red-400 bg-red-100 text-red-800"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            <span className="font-bold mr-1">{["ক", "খ", "গ", "ঘ"][oIdx]}.</span>
                            {opt}
                            {oIdx === correct && <span className="ml-1 text-green-700"> ✓</span>}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button size="lg" variant="outline" className="flex-1" onClick={() => {
                if (selectedSubject?.chapters?.length) {
                  setStep("select-chapter");
                } else {
                  setStep("select-subject");
                }
                setSelectedChapter(null);
                setAnswers([]);
                setSubmitted(false);
              }}>
                {selectedSubject?.chapters?.length ? "অন্য অধ্যায় দেখুন" : "একই শ্রেণিতে ভিন্ন বিষয়"}
              </Button>
              <Button size="lg" variant="outline" className="flex-1" onClick={handleRestart}>
                <RotateCcw className="mr-2 w-4 h-4" /> নতুন পরীক্ষা
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getSubjectIcon(name: string): string {
  const map: Record<string, string> = {
    "বাংলা": "📚",
    "ইংরেজি": "🔤",
    "গণিত": "🔢",
    "উচ্চতর গণিত": "📐",
    "পদার্থবিজ্ঞান": "⚡",
    "পদার্থবিজ্ঞান ১ম পত্র": "⚡",
    "পদার্থবিজ্ঞান ২য় পত্র": "⚡",
    "রসায়ন": "🧪",
    "রসায়ন ১ম পত্র": "🧪",
    "রসায়ন ২য় পত্র": "🧪",
    "জীববিজ্ঞান": "🌿",
    "জীববিজ্ঞান ১ম পত্র": "🌿",
    "জীববিজ্ঞান ২য় পত্র": "🌿",
    "বিজ্ঞান": "🔬",
    "তথ্য ও যোগাযোগ প্রযুক্তি": "💻",
    "সামাজিক বিজ্ঞান": "🌍",
    "সমাজ পরিচিতি": "🏘️",
    "পরিবেশ পরিচিতি বিজ্ঞান": "🌱",
    "ইসলাম ও নৈতিক শিক্ষা": "🕌",
    "ইসলাম ধর্ম": "🕌",
    "বাংলাদেশ ও বিশ্বপরিচয়": "🗺️",
    "ইতিহাস": "📜",
    "পৌরনীতি": "⚖️",
    "অর্থনীতি": "💰",
    "ইসলামের ইতিহাস": "📖",
    "সমাজবিজ্ঞান": "👥",
    "হিসাববিজ্ঞান": "🧾",
    "ব্যবসায় সংগঠন ও ব্যবস্থাপনা": "🏢",
    "ফিন্যান্স ও ব্যাংকিং": "🏦",
  };
  return map[name] ?? "📝";
}
