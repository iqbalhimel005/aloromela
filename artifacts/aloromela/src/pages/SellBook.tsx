import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateSellRequest, CreateSellRequestBodyCondition, BookCategory } from "@workspace/api-client-react";
import {
  SCHOOL_CLASSES,
  COLLEGE_GROUPS,
  DEGREE_YEARS,
  HONOURS_SUBJECTS,
  HONOURS_YEARS,
  getHonoursSlug,
} from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BookUp, Info, CheckCircle2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const sellBookSchema = z.object({
  sellerName: z.string().min(2, { message: "আপনার নাম দিন" }),
  mobile: z.string().regex(/^01[3-9]\d{8}$/, { message: "সঠিক মোবাইল নম্বর দিন" }),
  bookTitle: z.string().min(2, { message: "বইয়ের নাম দিন" }),
  bookAuthor: z.string().optional(),
  category: z.string().min(1, { message: "ক্যাটাগরি নির্বাচন করুন" }),
  condition: z.enum(["new", "good", "fair"] as const),
  askingPrice: z.coerce.number().min(1, { message: "মূল্য দিন" }),
  description: z.string().optional(),
});

type SellBookFormValues = z.infer<typeof sellBookSchema>;

export function SellBook() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createSellRequest = useCreateSellRequest();

  const form = useForm<SellBookFormValues>({
    resolver: zodResolver(sellBookSchema),
    defaultValues: {
      sellerName: "",
      mobile: "",
      bookTitle: "",
      bookAuthor: "",
      category: "",
      condition: "good",
      askingPrice: 0,
      description: "",
    },
  });

  const onSubmit = (data: SellBookFormValues) => {
    createSellRequest.mutate(
      { data: { ...data, condition: data.condition as CreateSellRequestBodyCondition, category: data.category as BookCategory } },
      {
        onSuccess: () => {
          toast({
            title: "সফল",
            description: "আপনার বই বিক্রির রিকোয়েস্ট সফলভাবে সাবমিট হয়েছে। আমরা দ্রুত যোগাযোগ করবো।",
          });
          form.reset();
          setLocation("/");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: "রিকোয়েস্ট সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
          });
        }
      }
    );
  };

  return (
    <div className="min-h-screen py-12 bg-muted/10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <BookUp className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">পুরাতন বই বিক্রি করুন</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            আপনার পড়া শেষে বই ঘরে ফেলে না রেখে আমাদের মাধ্যমে বিক্রি করে দিন। নিচের ফর্মটি পূরণ করুন, আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবে।
          </p>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm p-6 md:p-8">
          <Alert className="mb-8 bg-blue-50 text-blue-800 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertDescription>
              বইয়ের অবস্থা অনুযায়ী আমরা মূল্য নির্ধারণ করে আপনাকে জানাবো। দুই পক্ষের সম্মতিতে বই সংগ্রহ করা হবে।
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg border-b pb-2">আপনার তথ্য</h3>
                  
                  <FormField
                    control={form.control}
                    name="sellerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>আপনার নাম <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="যেমন: রহিম মিয়া" {...field} data-testid="input-seller-name" />
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
                        <FormLabel>মোবাইল নম্বর <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="01XXXXXXXXX" type="tel" {...field} data-testid="input-seller-mobile" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="font-semibold text-lg border-b pb-2">বইয়ের তথ্য</h3>
                  
                  <FormField
                    control={form.control}
                    name="bookTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>বইয়ের নাম <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="যেমন: পথের পাঁচালী" {...field} data-testid="input-sell-book-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bookAuthor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>লেখকের নাম</FormLabel>
                        <FormControl>
                          <Input placeholder="যেমন: বিভূতিভূষণ বন্দ্যোপাধ্যায়" {...field} data-testid="input-sell-book-author" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 pt-4 border-t">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ক্যাটাগরি <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-sell-category">
                            <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-64">
                          <SelectGroup>
                            <SelectLabel>স্কুল</SelectLabel>
                            {SCHOOL_CLASSES.map(c => (
                              <SelectItem key={c.slug} value={c.slug}>{c.label}</SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>কলেজ</SelectLabel>
                            {COLLEGE_GROUPS.map(c => (
                              <SelectItem key={c.slug} value={c.slug}>{c.label}</SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>ডিগ্রি</SelectLabel>
                            {DEGREE_YEARS.map(c => (
                              <SelectItem key={c.slug} value={c.slug}>{c.label}</SelectItem>
                            ))}
                          </SelectGroup>
                          {HONOURS_SUBJECTS.map(s => (
                            <SelectGroup key={s.slug}>
                              <SelectLabel>অনার্স: {s.label}</SelectLabel>
                              {HONOURS_YEARS.map(y => (
                                <SelectItem key={y.suffix} value={getHonoursSlug(s.slug, y.suffix)}>
                                  {y.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                          <SelectGroup>
                            <SelectLabel>অন্যান্য</SelectLabel>
                            <SelectItem value="job">চাকরি</SelectItem>
                            <SelectItem value="novel">উপন্যাস</SelectItem>
                            <SelectItem value="story-poem">গল্প কবিতা</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>অবস্থা <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-sell-condition">
                            <SelectValue placeholder="অবস্থা নির্বাচন করুন" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">নতুনের মত</SelectItem>
                          <SelectItem value="good">ভালো</SelectItem>
                          <SelectItem value="fair">মোটামুটি</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="askingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>প্রত্যাশিত মূল্য (৳) <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} data-testid="input-sell-price" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>বই সম্পর্কে বিস্তারিত (ঐচ্ছিক)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="বইয়ের অবস্থা, কতদিন ব্যবহৃত হয়েছে ইত্যাদি সম্পর্কে লিখুন" 
                        className="resize-none"
                        {...field} 
                        data-testid="input-sell-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="px-8 font-bold"
                  disabled={createSellRequest.isPending}
                  data-testid="button-submit-sell"
                >
                  {createSellRequest.isPending ? "সাবমিট হচ্ছে..." : "রিকোয়েস্ট সাবমিট করুন"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
