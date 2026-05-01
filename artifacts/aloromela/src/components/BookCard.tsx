import { Link } from "wouter";
import { Star, ShoppingCart, FileDown } from "lucide-react";
import { Book } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { toast } = useToast();
  const discount = book.discountedPrice 
    ? Math.floor(((book.price - book.discountedPrice) / book.price) * 100) 
    : 0;

  const isFree = Number(book.price) === 0;
  const hasPdf = !!book.pdfUrl;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "কার্টে যোগ করা হয়েছে",
      description: `${book.titleBn || book.title} আপনার কার্টে যোগ করা হয়েছে।`,
    });
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (book.pdfUrl) {
      window.open(book.pdfUrl, "_blank");
    }
  };

  return (
    <Link href={`/books/${book.id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 cursor-pointer h-full flex flex-col bg-card" data-testid={`card-book-${book.id}`}>
        <div className="relative">
          <AspectRatio ratio={3/4}>
            <div className="absolute inset-0 bg-muted/20" />
            <img 
              src={book.coverImage || "https://placehold.co/300x400/f5f5f5/a0a0a0?text=No+Cover"} 
              alt={book.titleBn || book.title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          </AspectRatio>
          {discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground font-bold px-2 py-1 z-10 shadow-sm border-none">
              {discount}% ছাড়
            </Badge>
          )}
          {isFree && hasPdf && (
            <Badge className="absolute top-2 right-2 bg-emerald-600 text-white font-bold px-2 py-1 z-10 shadow-sm border-none">
              বিনামূল্যে
            </Badge>
          )}
          {book.isFeatured && (
            <Badge variant="secondary" className="absolute top-2 left-2 bg-secondary text-secondary-foreground font-semibold px-2 py-1 z-10 shadow-sm border-none">
              জনপ্রিয়
            </Badge>
          )}
          
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
            {hasPdf && isFree ? (
              <Button onClick={handleDownload} size="sm" className="w-full font-semibold gap-2 shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-emerald-600 hover:bg-emerald-700">
                <FileDown className="w-4 h-4" /> পড়ুন / ডাউনলোড
              </Button>
            ) : (
              <Button onClick={handleAddToCart} size="sm" className="w-full font-semibold gap-2 shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <ShoppingCart className="w-4 h-4" /> কার্টে যোগ করুন
              </Button>
            )}
          </div>
        </div>
        
        <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-2">
          <div>
            <h3 className="font-bold text-base leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {book.titleBn || book.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{book.authorBn || book.author}</p>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-col">
              {isFree && hasPdf ? (
                <span className="text-lg font-bold text-emerald-600 font-mono">বিনামূল্যে</span>
              ) : book.discountedPrice ? (
                <>
                  <span className="text-xs text-muted-foreground line-through font-mono">৳{book.price}</span>
                  <span className="text-lg font-bold text-primary font-mono">৳{book.discountedPrice}</span>
                </>
              ) : (
                <span className="text-lg font-bold text-primary font-mono">৳{book.price}</span>
              )}
            </div>
            
            {book.rating && (
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded text-amber-600 dark:text-amber-500 border border-amber-200/50 dark:border-amber-900/50">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs font-semibold">{book.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
