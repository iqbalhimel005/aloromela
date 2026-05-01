import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Filter, BookOpen, ChevronDown } from "lucide-react";
import { useListBooks, getListBooksQueryKey, BookCategory } from "@workspace/api-client-react";
import { BookCard } from "@/components/BookCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  SCHOOL_CLASSES,
  COLLEGE_GROUPS,
  DEGREE_YEARS,
  HONOURS_SUBJECTS,
  HONOURS_YEARS,
  getHonoursSlug,
  getCategoryLabel,
} from "@/lib/categories";

function AccordionSection({
  label,
  isActive,
  children,
}: {
  label: string;
  isActive?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(isActive ?? false);
  useEffect(() => { if (isActive) setOpen(true); }, [isActive]);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
          isActive ? "text-primary" : "hover:bg-muted text-foreground"
        }`}
      >
        <span>{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pl-3 pt-0.5 pb-1 space-y-0.5">{children}</div>}
    </div>
  );
}

function CategoryButton({
  slug,
  label,
  active,
  onClick,
}: {
  slug: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
        active
          ? "bg-primary text-primary-foreground font-medium"
          : "hover:bg-muted text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

export function Books() {
  const params = useParams();
  const routeCategory = (params as { slug?: string }).slug || "all";
  const [activeCategory, setActiveCategory] = useState<string>(routeCategory);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setActiveCategory(routeCategory);
    setPage(1);
  }, [routeCategory]);

  const queryParams = {
    category: activeCategory !== "all" ? activeCategory as BookCategory : undefined,
    page,
    limit: 20,
  };

  const { data, isLoading } = useListBooks(queryParams, {
    query: { queryKey: getListBooksQueryKey(queryParams) },
  });

  const isCategoryActive = (slug: string) => activeCategory === slug;

  const isSchoolActive = activeCategory.startsWith("school-");
  const isCollegeActive = activeCategory.startsWith("college-");
  const isDegreeActive = activeCategory.startsWith("degree-");
  const isHonoursActive = activeCategory.startsWith("honours-");

  const getActiveHonoursSubject = () => {
    if (!isHonoursActive) return null;
    const knownSuffixes = HONOURS_YEARS.map(y => y.suffix);
    const withoutPrefix = activeCategory.slice("honours-".length);
    for (const suffix of knownSuffixes) {
      if (withoutPrefix.endsWith("-" + suffix)) {
        const subjectSlug = withoutPrefix.slice(0, -(suffix.length + 1));
        return HONOURS_SUBJECTS.find(s => s.slug === subjectSlug)?.slug ?? null;
      }
    }
    return null;
  };

  const handleCategory = (slug: string) => {
    setActiveCategory(slug);
    setPage(1);
  };

  const FilterSidebar = () => (
    <div className="space-y-1">
      <h3 className="font-bold text-base mb-3 px-1">ক্যাটাগরি</h3>

      <CategoryButton slug="all" label="সব বই" active={activeCategory === "all"} onClick={() => handleCategory("all")} />

      {/* স্কুল */}
      <AccordionSection label="স্কুল" isActive={isSchoolActive}>
        {SCHOOL_CLASSES.map(c => (
          <CategoryButton key={c.slug} slug={c.slug} label={c.label} active={isCategoryActive(c.slug)} onClick={() => handleCategory(c.slug)} />
        ))}
      </AccordionSection>

      {/* কলেজ */}
      <AccordionSection label="কলেজ" isActive={isCollegeActive}>
        {COLLEGE_GROUPS.map(c => (
          <CategoryButton key={c.slug} slug={c.slug} label={c.label} active={isCategoryActive(c.slug)} onClick={() => handleCategory(c.slug)} />
        ))}
      </AccordionSection>

      {/* ডিগ্রি */}
      <AccordionSection label="ডিগ্রি" isActive={isDegreeActive}>
        {DEGREE_YEARS.map(c => (
          <CategoryButton key={c.slug} slug={c.slug} label={c.label} active={isCategoryActive(c.slug)} onClick={() => handleCategory(c.slug)} />
        ))}
      </AccordionSection>

      {/* অনার্স / মাস্টার্স */}
      <AccordionSection label="অনার্স / মাস্টার্স" isActive={isHonoursActive}>
        {HONOURS_SUBJECTS.map(s => {
          const isSubjectActive = getActiveHonoursSubject() === s.slug;
          return (
            <AccordionSection key={s.slug} label={s.label} isActive={isSubjectActive}>
              <div className="space-y-0.5">
                <div className="text-xs text-muted-foreground px-2 pt-1 pb-0.5 font-semibold">অনার্স</div>
                {HONOURS_YEARS.filter(y => y.suffix.startsWith("year")).map(y => {
                  const slug = getHonoursSlug(s.slug, y.suffix);
                  return (
                    <CategoryButton key={slug} slug={slug} label={y.label} active={isCategoryActive(slug)} onClick={() => handleCategory(slug)} />
                  );
                })}
                <div className="text-xs text-muted-foreground px-2 pt-1 pb-0.5 font-semibold">মাস্টার্স</div>
                {HONOURS_YEARS.filter(y => y.suffix.startsWith("masters")).map(y => {
                  const slug = getHonoursSlug(s.slug, y.suffix);
                  return (
                    <CategoryButton key={slug} slug={slug} label={y.label} active={isCategoryActive(slug)} onClick={() => handleCategory(slug)} />
                  );
                })}
              </div>
            </AccordionSection>
          );
        })}
      </AccordionSection>

      {/* Others */}
      {[
        { slug: "job", label: "চাকরি" },
        { slug: "novel", label: "উপন্যাস" },
        { slug: "story-poem", label: "গল্প কবিতা" },
        { slug: "pdf", label: "পিডিএফ" },
      ].map(c => (
        <CategoryButton key={c.slug} slug={c.slug} label={c.label} active={isCategoryActive(c.slug)} onClick={() => handleCategory(c.slug)} />
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:hidden mb-6 gap-4">
        <h1 className="text-2xl font-bold text-foreground">{getCategoryLabel(activeCategory)}</h1>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full gap-2">
                <Filter className="w-4 h-4" />
                ফিল্টার করুন
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader className="mb-4 text-left">
                <SheetTitle>ফিল্টার</SheetTitle>
              </SheetHeader>
              <FilterSidebar />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div className="hidden md:block col-span-1 border-r pr-4">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <FilterSidebar />
          </div>
        </div>

        <div className="col-span-1 md:col-span-3 lg:col-span-4">
          <div className="hidden md:flex justify-between items-center mb-6 pb-4 border-b">
            <h1 className="text-2xl font-bold text-foreground">{getCategoryLabel(activeCategory)}</h1>
            {data && (
              <span className="text-muted-foreground text-sm">
                মোট {data.total} টি বই পাওয়া গেছে
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {isLoading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[250px] w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-5 w-1/3 mt-2" />
                </div>
              ))
            ) : data?.books && data.books.length > 0 ? (
              data.books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-muted/20 rounded-2xl border border-dashed">
                <BookOpen className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-foreground mb-2">কোনো বই পাওয়া যায়নি</h3>
                <p className="text-muted-foreground">এই ক্যাটাগরিতে বর্তমানে কোনো বই নেই।</p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => handleCategory("all")}
                >
                  সব বই দেখুন
                </Button>
              </div>
            )}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                পূর্ববর্তী
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, data.totalPages) }).map((_, i) => {
                  let pageNum = i + 1;
                  if (data.totalPages > 5 && page > 3) {
                    pageNum = page - 2 + i;
                    if (pageNum > data.totalPages) return null;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      className="w-10 h-10 p-0"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                disabled={page === data.totalPages}
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
              >
                পরবর্তী
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
