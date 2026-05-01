import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateBookRequest, BookCategory } from "@workspace/api-client-react";
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
import { Search, Info } from "lucide-react";
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

const requestBookSchema = z.object({
  requesterName: z.string().min(2, { message: "আপনার নাম দিন" }),
  mobile: z.string().regex(/^01[3-9]\d{8}$/, { message: "সঠিক মোবাইল নম্বর দিন" }),
  bookTitle: z.string().min(2, { message: "বইয়ের নাম দিন" }),
  bookAuthor: z.string().optional(),
  category: z.string().optional(),
  notes: z.string().optional(),
});

type RequestBookFormValues = z.infer<typeof requestBookSchema>;

export function BookRequest() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createRequest = useCreateBookRequest();

  const form = useForm<RequestBookFormValues>({
    resolver: zodResolver(requestBookSchema),
    defaultValues: {
      requesterName: "",
      mobile: "",
      bookTitle: "",
      bookAuthor: "",
      category: "",
      notes: "",
    },
  });

  const onSubmit = (data: RequestBookFormValues) => {
    createRequest.mutate(
      { data: { ...data, category: data.category as BookCategory | undefined } },
      {
        onSuccess: () => {
          toast({
            title: "সফল",
            description: "বইয়ের রিকোয়েস্ট সাবমিট হয়েছে। বইটি সংগ্রহ করতে পারলে আমরা আপনাকে জানাবো।",
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
    <div className="min-h-[85vh] py-12 flex items-center bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-card rounded-3xl border shadow-lg overflow-hidden">
          
          <div className="bg-primary px-8 py-10 text-primary-foreground text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://placehold.co/800x400/primary/primary?text=Pattern')] opacity-10 mix-blend-overlay"></div>
            <Search className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h1 className="text-3xl font-bold mb-2 relative z-10">বই পাচ্ছেন না?</h1>
            <p className="text-primary-foreground/90 max-w-md mx-auto relative z-10">
              যে বইটি খুঁজছেন তা আমাদের কালেকশনে না পেলে এখানে রিকোয়েস্ট করুন। আমরা বইটি সংগ্রহ করে আপনাকে জানিয়ে দেব।
            </p>
          </div>

          <div className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="bookTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>বইয়ের নাম <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="যেমন: প্যারাডক্সিক্যাল সাজিদ" {...field} data-testid="input-req-book-title" />
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
                          <Input placeholder="যেমন: আরিফ আজাদ" {...field} data-testid="input-req-book-author" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ক্যাটাগরি</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-req-category">
                              <SelectValue placeholder="নির্বাচন করুন (ঐচ্ছিক)" />
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
                </div>

                <div className="border-t pt-6 mt-6">
                  <h3 className="font-medium text-muted-foreground mb-4">যোগাযোগের তথ্য</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="requesterName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>আপনার নাম <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="আপনার পূর্ণ নাম" {...field} data-testid="input-req-name" />
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
                            <Input placeholder="01XXXXXXXXX" type="tel" {...field} data-testid="input-req-mobile" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>অতিরিক্ত তথ্য (ঐচ্ছিক)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="প্রকাশনী, সংস্করণ বা অন্য কোনো তথ্য থাকলে লিখতে পারেন" 
                          className="resize-none"
                          {...field} 
                          data-testid="input-req-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold shadow-md rounded-xl"
                  disabled={createRequest.isPending}
                  data-testid="button-submit-request"
                >
                  {createRequest.isPending ? "সাবমিট হচ্ছে..." : "রিকোয়েস্ট পাঠান"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
