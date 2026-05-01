import { useParams, Link } from "wouter";
import { Star, ShoppingCart, BookOpen, Share2, Heart, AlertCircle } from "lucide-react";
import { useGetBook, getGetBookQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function BookDetail() {
  const { id } = useParams();
  const bookId = Number(id);
  const { toast } = useToast();

  const { data: book, isLoading, error } = useGetBook(bookId, {
    query: { 
      queryKey: getGetBookQueryKey(bookId),
      enabled: !!bookId 
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 lg:col-span-3">
            <Skeleton className="w-full aspect-[3/4] rounded-xl" />
          </div>
          <div className="md:col-span-8 lg:col-span-9 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-8 w-1/4 mt-6" />
            <div className="space-y-2 pt-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>ত্রুটি</AlertTitle>
          <AlertDescription>বইটি খুঁজে পাওয়া যায়নি অথবা সার্ভারে কোনো সমস্যা হয়েছে।</AlertDescription>
        </Alert>
        <Link href="/books">
          <Button>সব বই দেখুন</Button>
        </Link>
      </div>
    );
  }

  const discount = book.discountedPrice 
    ? Math.round(((book.price - book.discountedPrice) / book.price) * 100) 
    : 0;

  const handleAddToCart = () => {
    toast({
      title: "কার্টে যোগ করা হয়েছে",
      description: `${book.titleBn || book.title} সফলভাবে কার্টে যোগ করা হয়েছে।`,
    });
  };

  const categoryLabels: Record<string, string> = {
    "school-new": "স্কুল (নতুন)",
    "school-old": "স্কুল (পুরাতন)",
    "college-new": "কলেজ (নতুন)",
    "college-old": "কলেজ (পুরাতন)",
    "university": "ভার্সিটি",
    "job": "চাকরি",
    "novel": "উপন্যাস",
    "story-poem": "গল্প কবিতা"
  };

  return (
    <div className="bg-muted/10 min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-card border-b py-4">
        <div className="container mx-auto px-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">হোম</Link>
          <span className="mx-2">/</span>
          <Link href={`/category/${book.category}`} className="hover:text-primary transition-colors">
            {categoryLabels[book.category] || book.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{book.titleBn || book.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl border shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            {/* Book Cover */}
            <div className="md:col-span-5 lg:col-span-4 relative group">
              <div className="rounded-xl overflow-hidden shadow-lg border bg-muted flex items-center justify-center">
                <img 
                  src={book.coverImage || "https://placehold.co/400x600/f5f5f5/a0a0a0?text=No+Cover"} 
                  alt={book.titleBn || book.title}
                  className="w-full object-cover aspect-[3/4]"
                />
              </div>
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground font-bold px-3 py-1.5 rounded-md shadow-md">
                  {discount}% ছাড়
                </div>
              )}
            </div>

            {/* Book Info */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {categoryLabels[book.category] || book.category}
                  </Badge>
                  {book.isFeatured && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
                      জনপ্রিয়
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">
                  {book.titleBn || book.title}
                </h1>
                
                <p className="text-xl text-muted-foreground mb-6">
                  লেখক: <span className="font-medium text-foreground">{book.authorBn || book.author}</span>
                </p>

                {book.rating && (
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(book.rating!) ? "fill-current" : "text-muted opacity-30"}`} />
                      ))}
                      <span className="ml-2 font-bold text-foreground">{book.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">({book.reviewCount || 0} রিভিউ)</span>
                  </div>
                )}

                <Separator className="my-6" />

                <div className="mb-6 flex items-end gap-4">
                  {book.discountedPrice ? (
                    <div className="flex flex-col">
                      <span className="text-muted-foreground line-through font-mono text-lg">৳{book.price}</span>
                      <span className="text-4xl font-bold text-primary font-mono tracking-tight">৳{book.discountedPrice}</span>
                    </div>
                  ) : (
                    <span className="text-4xl font-bold text-primary font-mono tracking-tight">৳{book.price}</span>
                  )}
                  
                  {book.stockCount > 0 ? (
                    <Badge variant="outline" className="mb-2 bg-green-50 text-green-700 border-green-200">স্টকে আছে ({book.stockCount})</Badge>
                  ) : (
                    <Badge variant="outline" className="mb-2 bg-red-50 text-red-700 border-red-200">স্টক আউট</Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 mb-8">
                  <Button 
                    size="lg" 
                    className="w-full text-base h-14 font-semibold shadow-md" 
                    onClick={handleAddToCart}
                    disabled={book.stockCount === 0}
                    data-testid="button-add-to-cart-detail"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> কার্টে যোগ করুন
                  </Button>
                  <Link href="/checkout">
                    <Button 
                      size="lg" 
                      variant="secondary" 
                      className="w-full text-base h-14 font-semibold shadow-sm"
                      disabled={book.stockCount === 0}
                      data-testid="button-buy-now"
                    >
                      এখনি কিনুন
                    </Button>
                  </Link>
                </div>
                
                <div className="flex gap-4 mb-2">
                  <Button variant="outline" size="sm" className="flex-1 text-muted-foreground hover:text-foreground">
                    <Heart className="mr-2 h-4 w-4" /> উইশলিস্ট
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-muted-foreground hover:text-foreground">
                    <Share2 className="mr-2 h-4 w-4" /> শেয়ার করুন
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8 bg-card rounded-2xl border shadow-sm overflow-hidden">
          <Tabs defaultValue="summary" className="w-full">
            <div className="border-b px-6 pt-2">
              <TabsList className="bg-transparent h-auto p-0 gap-6">
                <TabsTrigger 
                  value="summary" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 font-semibold text-base"
                >
                  বইয়ের সারসংক্ষেপ
                </TabsTrigger>
                <TabsTrigger 
                  value="details" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 font-semibold text-base"
                >
                  বইয়ের বিবরণ
                </TabsTrigger>
                {(book.previewText || book.previewTextBn) && (
                  <TabsTrigger 
                    value="preview" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 font-semibold text-base flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" /> অল্প পড়ে দেখুন
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
            <div className="p-6 md:p-8">
              <TabsContent value="summary" className="mt-0 outline-none">
                <div className="prose dark:prose-invert max-w-none">
                  {book.descriptionBn || book.description ? (
                    <p className="whitespace-pre-line text-muted-foreground leading-relaxed text-lg">
                      {book.descriptionBn || book.description}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic">কোনো সারসংক্ষেপ দেওয়া হয়নি।</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="details" className="mt-0 outline-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
                  <div className="flex flex-col pb-4 border-b border-border/50">
                    <span className="text-muted-foreground mb-1">শিরোনাম</span>
                    <span className="font-medium text-foreground">{book.titleBn || book.title}</span>
                  </div>
                  <div className="flex flex-col pb-4 border-b border-border/50">
                    <span className="text-muted-foreground mb-1">লেখক</span>
                    <span className="font-medium text-foreground">{book.authorBn || book.author}</span>
                  </div>
                  <div className="flex flex-col pb-4 border-b border-border/50">
                    <span className="text-muted-foreground mb-1">প্রকাশনী</span>
                    <span className="font-medium text-foreground">{book.publisherBn || book.publisher || "অজ্ঞাত"}</span>
                  </div>
                  <div className="flex flex-col pb-4 border-b border-border/50">
                    <span className="text-muted-foreground mb-1">ক্যাটাগরি</span>
                    <span className="font-medium text-foreground">{categoryLabels[book.category] || book.category}</span>
                  </div>
                  {book.isbn && (
                    <div className="flex flex-col pb-4 border-b border-border/50">
                      <span className="text-muted-foreground mb-1">ISBN</span>
                      <span className="font-medium text-foreground">{book.isbn}</span>
                    </div>
                  )}
                  {book.edition && (
                    <div className="flex flex-col pb-4 border-b border-border/50">
                      <span className="text-muted-foreground mb-1">সংস্করণ</span>
                      <span className="font-medium text-foreground">{book.edition}</span>
                    </div>
                  )}
                </div>
              </TabsContent>
              {(book.previewText || book.previewTextBn) && (
                <TabsContent value="preview" className="mt-0 outline-none">
                  <div className="bg-muted/30 p-6 rounded-xl border border-muted-foreground/10 font-serif text-lg leading-loose whitespace-pre-line text-foreground/90">
                    {book.previewTextBn || book.previewText}
                  </div>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
