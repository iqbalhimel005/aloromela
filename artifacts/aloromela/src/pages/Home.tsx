import { Link } from "wouter";
import { ArrowRight, BookOpen, GraduationCap, Library, Briefcase, Feather, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetFeaturedBooks, useGetBookStats, useListOffers, getGetFeaturedBooksQueryKey, getGetBookStatsQueryKey, getListOffersQueryKey } from "@workspace/api-client-react";
import { BookCard } from "@/components/BookCard";
import { Skeleton } from "@/components/ui/skeleton";

export function Home() {
  const { data: featuredBooks, isLoading: isLoadingBooks } = useGetFeaturedBooks({
    query: { queryKey: getGetFeaturedBooksQueryKey() }
  });
  
  const { data: stats, isLoading: isLoadingStats } = useGetBookStats({
    query: { queryKey: getGetBookStatsQueryKey() }
  });

  const { data: offers } = useListOffers({
    query: { queryKey: getListOffersQueryKey() }
  });

  const categories = [
    { title: "স্কুলের বই", icon: <BookOpen className="w-8 h-8 mb-2 text-primary" />, slug: "school-class6" },
    { title: "কলেজের বই", icon: <GraduationCap className="w-8 h-8 mb-2 text-primary" />, slug: "college-science" },
    { title: "ডিগ্রি / অনার্স", icon: <Library className="w-8 h-8 mb-2 text-primary" />, slug: "degree-year1" },
    { title: "চাকরি", icon: <Briefcase className="w-8 h-8 mb-2 text-primary" />, slug: "job" },
    { title: "উপন্যাস", icon: <Feather className="w-8 h-8 mb-2 text-primary" />, slug: "novel" },
    { title: "গল্প ও কবিতা", icon: <Sparkles className="w-8 h-8 mb-2 text-primary" />, slug: "story-poem" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary/5 dark:bg-primary/10 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/primary/primary?text=Pattern')] opacity-5 mix-blend-multiply"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1 text-sm font-medium">বাংলাদেশের সবচেয়ে বিশ্বস্ত অনলাইন বুকশপ</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight max-w-4xl tracking-tight">
            বই পড়ি, নিই <span className="text-primary">দেশ গড়ার</span> শপথ<br />
            আলোকিত জাতি, সমৃদ্ধ ভবিষৎ
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl font-medium">
            প্রয়োজনীয় সকল বই এখন আপনার আরো কাছে, হাতের নাগালে ――
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/books">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/20" data-testid="button-shop-now">
                বই খুঁজুন <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/offers">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full bg-background" data-testid="button-offers">
                অফার সমূহ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {isLoadingStats ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4">
                  <Skeleton className="h-10 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))
            ) : stats ? (
              <>
                <div className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-primary/5 transition-colors">
                  <span className="text-3xl md:text-4xl font-bold text-primary mb-1 font-mono">{stats.total}+</span>
                  <span className="text-muted-foreground font-medium">মোট বই</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-primary/5 transition-colors">
                  <span className="text-3xl md:text-4xl font-bold text-primary mb-1 font-mono">{stats.school}+</span>
                  <span className="text-muted-foreground font-medium">স্কুলের বই</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-primary/5 transition-colors">
                  <span className="text-3xl md:text-4xl font-bold text-primary mb-1 font-mono">{stats.college}+</span>
                  <span className="text-muted-foreground font-medium">কলেজের বই</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-primary/5 transition-colors">
                  <span className="text-3xl md:text-4xl font-bold text-primary mb-1 font-mono">{stats.job}+</span>
                  <span className="text-muted-foreground font-medium">চাকরির বই</span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">ক্যাটাগরি সমূহ</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <Link key={index} href={`/category/${cat.slug}`}>
                <div className="bg-card border rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group h-full">
                  <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform group-hover:bg-primary group-hover:text-primary-foreground">
                    {cat.icon}
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{cat.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">জনপ্রিয় বই সমূহ</h2>
              <div className="w-16 h-1 bg-primary rounded-full"></div>
            </div>
            <Link href="/books">
              <Button variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary font-semibold" data-testid="link-view-all">
                সব দেখুন <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {isLoadingBooks ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[250px] w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-5 w-1/3 mt-2" />
                </div>
              ))
            ) : featuredBooks && featuredBooks.length > 0 ? (
              featuredBooks.slice(0, 5).map((book) => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                কোনো বই পাওয়া যায়নি।
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Offers Section */}
      {offers && offers.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">বিশেষ অফার ও ছাড়</h2>
                <div className="w-16 h-1 bg-primary rounded-full"></div>
              </div>
              <Link href="/offers">
                <Button variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary font-semibold">
                  সব অফার দেখুন <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {offers.slice(0, 4).map((offer) => (
                <div key={offer.id} className="bg-primary text-primary-foreground rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="relative z-10">
                    {offer.badgeText && (
                      <span className="inline-block bg-white/20 text-primary-foreground text-xs font-bold px-2 py-1 rounded-full mb-3">
                        {offer.badgeText}
                      </span>
                    )}
                    <div className="text-4xl font-bold mb-1">{offer.discountPercent}%</div>
                    <div className="text-primary-foreground/80 text-sm mb-3">ডিসকাউন্ট</div>
                    <h3 className="font-bold text-lg mb-2">{offer.titleBn}</h3>
                    <p className="text-primary-foreground/80 text-sm line-clamp-2">{offer.descriptionBn}</p>
                    <Link href="/books">
                      <Button variant="secondary" size="sm" className="mt-4 rounded-full text-primary text-xs">
                        বই দেখুন <ArrowRight className="ml-1 w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Links Banner */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-primary-foreground/20">
            <div className="flex flex-col items-center px-4 pt-4 md:pt-0">
              <h3 className="text-xl font-bold mb-2">পুরাতন বই বিক্রি করুন</h3>
              <p className="text-primary-foreground/80 mb-4 text-sm max-w-xs">আপনার পড়া শেষে বই ঘরে ফেলে না রেখে আমাদের মাধ্যমে বিক্রি করে দিন।</p>
              <Link href="/sell-book">
                <Button variant="secondary" className="rounded-full w-full max-w-[200px] text-primary" data-testid="button-sell-book-banner">বিস্তারিত</Button>
              </Link>
            </div>
            <div className="flex flex-col items-center px-4 pt-8 md:pt-0">
              <h3 className="text-xl font-bold mb-2">বইয়ের রিকোয়েস্ট</h3>
              <p className="text-primary-foreground/80 mb-4 text-sm max-w-xs">যে বইটি খুঁজছেন তা না পেলে আমাদের জানান, আমরা সংগ্রহ করে দেব।</p>
              <Link href="/book-request">
                <Button variant="secondary" className="rounded-full w-full max-w-[200px] text-primary" data-testid="button-request-book-banner">রিকোয়েস্ট দিন</Button>
              </Link>
            </div>
            <div className="flex flex-col items-center px-4 pt-8 md:pt-0">
              <h3 className="text-xl font-bold mb-2">নতুন লেখকদের বিজ্ঞাপন</h3>
              <p className="text-primary-foreground/80 mb-4 text-sm max-w-xs">নতুন প্রকাশিত বইয়ের বিজ্ঞাপন দিয়ে সহজেই পাঠকের কাছে পৌঁছান।</p>
              <Link href="/author-ads">
                <Button variant="secondary" className="rounded-full w-full max-w-[200px] text-primary" data-testid="button-author-ads-banner">বিজ্ঞাপন দিন</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

