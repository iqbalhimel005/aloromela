import { useListOffers, getListOffersQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowRight, Tag, Percent, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export function Offers() {
  const { data: offers, isLoading } = useListOffers({
    query: { queryKey: getListOffersQueryKey() }
  });

  return (
    <div className="min-h-screen bg-muted/10 pb-16">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[120%] bg-white rounded-full blur-3xl transform rotate-12"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[100%] bg-white rounded-full blur-3xl transform -rotate-12"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-4 px-4 py-1 text-sm">
            <Sparkles className="w-4 h-4 mr-2" /> বিশেষ অফার
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">সবচেয়ে সেরা ডিসকাউন্ট</h1>
          <p className="text-primary-foreground/90 text-lg md:text-xl max-w-2xl mx-auto">
            আলোরমেলায় চলছে আকর্ষণীয় অফার। পছন্দের বই কিনে সাশ্রয় করুন!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="border-none shadow-md rounded-2xl overflow-hidden">
                <Skeleton className="h-32 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-6" />
                  <Skeleton className="h-10 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : offers && offers.length > 0 ? (
            offers.map((offer) => (
              <Card key={offer.id} className="border-none shadow-md rounded-2xl overflow-hidden group hover:shadow-lg transition-shadow relative" data-testid={`card-offer-${offer.id}`}>
                {offer.badgeText && (
                  <Badge className="absolute top-4 right-4 z-20 shadow-md bg-white text-primary hover:bg-white border-none font-bold px-3 py-1">
                    {offer.badgeText}
                  </Badge>
                )}
                
                <div className="bg-gradient-to-r from-primary/90 to-primary h-32 relative flex items-center px-6 overflow-hidden">
                  {/* Decorative circles */}
                  <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="absolute bottom-[-10px] right-[40px] w-16 h-16 bg-white/10 rounded-full"></div>
                  
                  <div className="flex items-center gap-4 text-white z-10">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                      <Percent className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="block text-3xl font-bold font-mono tracking-tight">{offer.discountPercent}%</span>
                      <span className="block text-white/90 font-medium">ডিসকাউন্ট</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6 relative">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {offer.titleBn}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {offer.descriptionBn}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-xs text-muted-foreground font-medium bg-muted/50 px-3 py-1.5 rounded-full">
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      {offer.endDate ? `মেয়াদ: ${format(new Date(offer.endDate), 'dd MMM yyyy')}` : 'সীমিত সময়ের জন্য'}
                    </div>
                    
                    <Link href={offer.category ? `/category/${offer.category}` : '/books'}>
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 hover:text-primary font-bold p-0 px-3" data-testid={`link-offer-${offer.id}`}>
                        বই দেখুন <ArrowRight className="ml-1 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-card rounded-3xl border shadow-sm">
              <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-2xl font-bold text-foreground mb-2">বর্তমানে কোনো অফার নেই</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                এই মুহূর্তে কোনো সক্রিয় অফার নেই। নতুন অফার এলে এখানে আপডেট করা হবে। সব বই দেখতে নিচে ক্লিক করুন।
              </p>
              <Link href="/books">
                <Button size="lg" className="rounded-full px-8">সব বই দেখুন</Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Newsletter Banner inside Offers */}
        <div className="mt-16 bg-card border rounded-3xl p-8 md:p-12 text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">অফার সম্পর্কে আগে জানতে চান?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            আমাদের নিউজলেটারে সাবস্ক্রাইব করুন এবং বিশেষ ডিসকাউন্ট ও অফারের খবর সবার আগে আপনার ইমেইলে পান।
          </p>
          <div className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-3">
            <input 
              type="email" 
              placeholder="আপনার ইমেইল দিন" 
              className="flex h-12 w-full rounded-md border border-input bg-transparent px-4 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button size="lg" className="h-12 px-8 shrink-0 font-bold">সাবস্ক্রাইব</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
