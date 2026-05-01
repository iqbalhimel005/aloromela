import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateAuthorAd, useListAuthorAds, getListAuthorAdsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PenTool, Megaphone, MapPin, Calendar, BookOpen } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const adSchema = z.object({
  authorName: z.string().min(2, { message: "লেখকের নাম দিন" }),
  mobile: z.string().regex(/^01[3-9]\d{8}$/, { message: "সঠিক মোবাইল নম্বর দিন" }),
  email: z.string().email({ message: "সঠিক ইমেইল দিন" }).optional().or(z.literal('')),
  bookTitle: z.string().min(2, { message: "বইয়ের নাম দিন" }),
  bookDescription: z.string().min(10, { message: "বই সম্পর্কে কিছু লিখুন" }),
  genre: z.string().min(2, { message: "ধরন/জনরা দিন" }),
  publisherName: z.string().optional(),
  publishYear: z.coerce.number().optional(),
  price: z.coerce.number().optional(),
});

type AdFormValues = z.infer<typeof adSchema>;

export function AuthorAds() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const { data: ads, isLoading, refetch } = useListAuthorAds({
    query: { queryKey: getListAuthorAdsQueryKey() }
  });
  
  const createAd = useCreateAuthorAd();

  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      authorName: "",
      mobile: "",
      email: "",
      bookTitle: "",
      bookDescription: "",
      genre: "",
      publisherName: "",
      publishYear: new Date().getFullYear(),
      price: undefined,
    },
  });

  const onSubmit = (data: AdFormValues) => {
    createAd.mutate(
      { data },
      {
        onSuccess: () => {
          toast({
            title: "সফল",
            description: "আপনার বিজ্ঞাপনটি পর্যালোচনার জন্য জমা দেওয়া হয়েছে।",
          });
          form.reset();
          setOpen(false);
          refetch(); // Soft refetch to ensure we have latest data
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: "বিজ্ঞাপন সাবমিট করতে সমস্যা হয়েছে।",
          });
        }
      }
    );
  };

  return (
    <div className="min-h-screen pb-16 bg-muted/10">
      {/* Hero Section */}
      <section className="bg-primary/5 border-b py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <PenTool className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">নতুন লেখকদের বিজ্ঞাপন</h1>
          <p className="text-lg text-muted-foreground mb-8">
            আপনি কি নতুন বই প্রকাশ করেছেন? আলোরমেলায় আপনার বইয়ের প্রমোশন করুন সম্পূর্ণ বিনামূল্যে এবং পৌঁছান হাজারো পাঠকের কাছে।
          </p>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 text-base" data-testid="button-post-ad">
                <Megaphone className="mr-2 w-5 h-5" /> বিজ্ঞাপন দিন
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">বইয়ের বিজ্ঞাপন দিন</DialogTitle>
                <DialogDescription>
                  আপনার প্রকাশিত নতুন বইয়ের তথ্য দিন। আমাদের টিম যাচাই করে ওয়েবসাইটে প্রকাশ করবে।
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="authorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>লেখকের নাম <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="আপনার নাম" {...field} data-testid="input-ad-author" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>মোবাইল <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="01XXXXXXXXX" type="tel" {...field} data-testid="input-ad-mobile" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bookTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>বইয়ের নাম <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="বইয়ের নাম" {...field} data-testid="input-ad-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="genre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ধরন/জনরা <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="যেমন: থ্রিলার, উপন্যাস" {...field} data-testid="input-ad-genre" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="publisherName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>প্রকাশনী (ঐচ্ছিক)</FormLabel>
                          <FormControl>
                            <Input placeholder="প্রকাশনীর নাম" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="publishYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>প্রকাশের বছর (ঐচ্ছিক)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="যেমন: ২০২৪" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>মূল্য (৳) (ঐচ্ছিক)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="০" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bookDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>বই সম্পর্কে <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="বইয়ের বিষয়বস্তু, ফ্ল্যাপের লেখা বা পাঠক কেন বইটি পড়বে তা লিখুন" 
                            className="resize-none h-24"
                            {...field} 
                            data-testid="input-ad-desc"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={createAd.isPending}>
                    {createAd.isPending ? "সাবমিট হচ্ছে..." : "বিজ্ঞাপন জমা দিন"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Ads List */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <BookOpen className="text-primary w-6 h-6" /> 
          সম্প্রতি প্রকাশিত বইসমূহ
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardHeader className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : ads && ads.length > 0 ? (
            ads.map((ad) => (
              <Card key={ad.id} className="overflow-hidden flex flex-col group hover:shadow-md transition-shadow" data-testid={`card-ad-${ad.id}`}>
                <div className="h-48 bg-primary/5 flex items-center justify-center border-b p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://placehold.co/400x200/primary/primary?text=Pattern')] opacity-5 mix-blend-multiply"></div>
                  {ad.coverImage ? (
                    <img src={ad.coverImage} alt={ad.bookTitle} className="h-full object-contain relative z-10 shadow-md group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="bg-card border shadow-sm w-32 h-40 flex items-center justify-center text-center p-2 relative z-10 group-hover:scale-105 transition-transform">
                      <span className="font-serif font-bold text-muted-foreground leading-tight">{ad.bookTitle}</span>
                    </div>
                  )}
                  <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground z-20">{ad.genre}</Badge>
                </div>
                
                <CardHeader className="pb-3">
                  <h3 className="text-xl font-bold line-clamp-1 text-foreground" title={ad.bookTitle}>{ad.bookTitle}</h3>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <PenTool className="w-3.5 h-3.5" /> {ad.authorName}
                  </p>
                </CardHeader>
                
                <CardContent className="flex-1 pb-4">
                  <p className="text-sm text-foreground/80 line-clamp-3 leading-relaxed">
                    {ad.bookDescription}
                  </p>
                </CardContent>
                
                <div className="px-6 pb-6 mt-auto">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground border-t pt-4">
                    {ad.publisherName && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {ad.publisherName}
                      </span>
                    )}
                    {ad.publishYear && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {ad.publishYear}
                      </span>
                    )}
                    {ad.price && (
                      <span className="flex items-center gap-1 font-mono font-medium text-foreground">
                        ৳{ad.price}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-card rounded-2xl border shadow-sm">
              <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-foreground mb-2">কোনো বিজ্ঞাপন নেই</h3>
              <p className="text-muted-foreground mb-6">এখনো কোনো লেখকের বিজ্ঞাপন প্রকাশ করা হয়নি।</p>
              <Button variant="outline" onClick={() => setOpen(true)}>প্রথম বিজ্ঞাপন দিন</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
