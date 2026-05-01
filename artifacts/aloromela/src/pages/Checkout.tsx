import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateOrder, CreateOrderBodyPaymentMethod } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Truck, CreditCard, Banknote, Building, Wallet } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const checkoutSchema = z.object({
  customerName: z.string().min(2, { message: "নাম দিন" }),
  mobile: z.string().regex(/^01[3-9]\d{8}$/, { message: "সঠিক মোবাইল নম্বর দিন" }),
  address: z.string().min(10, { message: "বিস্তারিত ঠিকানা দিন" }),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cash", "bkash", "rocket", "nagad", "sonali-bank", "islami-bank"] as const),
  paymentNumber: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createOrder = useCreateOrder();
  const [selectedMethod, setSelectedMethod] = useState<string>("cash");

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      mobile: "",
      address: "",
      notes: "",
      paymentMethod: "cash",
      paymentNumber: "",
    },
  });

  const onSubmit = (data: CheckoutFormValues) => {
    // Check if MFS method selected but no number provided
    if (["bkash", "rocket", "nagad"].includes(data.paymentMethod) && !data.paymentNumber) {
      form.setError("paymentNumber", { type: "manual", message: "যে নম্বর থেকে টাকা পাঠিয়েছেন তা দিন" });
      return;
    }

    // Mock cart items since we don't have global cart state
    const mockItems = [
      { bookId: 1, quantity: 1 }
    ];

    createOrder.mutate(
      { 
        data: { 
          ...data,
          paymentMethod: data.paymentMethod as CreateOrderBodyPaymentMethod,
          items: mockItems 
        } 
      },
      {
        onSuccess: (res) => {
          toast({
            title: "অর্ডার সম্পন্ন হয়েছে",
            description: `আপনার অর্ডার আইডি: ${res.orderNumber}`,
          });
          setLocation("/");
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: "অর্ডার সম্পন্ন করতে সমস্যা হয়েছে।",
          });
        }
      }
    );
  };

  const paymentMethods = [
    { id: "cash", label: "ক্যাশ অন ডেলিভারি", icon: Banknote, color: "text-emerald-600", desc: "পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন" },
    { id: "bkash", label: "বিকাশ", icon: Wallet, color: "text-pink-600", desc: "017 24 24 93 93 (Personal)" },
    { id: "nagad", label: "নগদ", icon: Wallet, color: "text-orange-500", desc: "017 24 24 93 93 (Personal)" },
    { id: "rocket", label: "রকেট", icon: Wallet, color: "text-purple-600", desc: "017 24 24 93 93 (Personal)" },
    { id: "sonali-bank", label: "সোনালী ব্যাংক", icon: Building, color: "text-blue-700", desc: "যোগাযোগ করুন: 017 24 24 93 93" },
    { id: "islami-bank", label: "ইসলামী ব্যাংক", icon: Building, color: "text-green-700", desc: "A/C: 20501200204619011" },
  ];

  return (
    <div className="bg-muted/10 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">চেকআউট</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Form */}
          <div className="lg:col-span-8 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="checkout-form">
                
                {/* Shipping Info */}
                <div className="bg-card rounded-2xl p-6 border shadow-sm">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                    <Truck className="text-primary w-5 h-5" />
                    <h2 className="text-xl font-bold">ডেলিভারি তথ্য</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>নাম <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="আপনার পূর্ণ নাম" {...field} data-testid="input-checkout-name" />
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
                            <Input placeholder="01XXXXXXXXX" type="tel" {...field} data-testid="input-checkout-mobile" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>বিস্তারিত ঠিকানা <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="বাড়ি নং, রাস্তা, এলাকা, থানা, জেলা" 
                            className="resize-none h-24"
                            {...field} 
                            data-testid="input-checkout-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>অতিরিক্ত নোট (ঐচ্ছিক)</FormLabel>
                        <FormControl>
                          <Input placeholder="ডেলিভারি ম্যানের জন্য কোনো নোট থাকলে দিন" {...field} data-testid="input-checkout-notes" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Payment Method */}
                <div className="bg-card rounded-2xl p-6 border shadow-sm">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                    <CreditCard className="text-primary w-5 h-5" />
                    <h2 className="text-xl font-bold">পেমেন্ট মেথড</h2>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormControl>
                          <RadioGroup
                            onValueChange={(val) => {
                              field.onChange(val);
                              setSelectedMethod(val);
                            }}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            data-testid="radio-payment-method"
                          >
                            {paymentMethods.map((method) => (
                              <div key={method.id}>
                                <RadioGroupItem
                                  value={method.id}
                                  id={method.id}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={method.id}
                                  className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                >
                                  <method.icon className={`mb-3 h-8 w-8 ${method.color}`} />
                                  <span className="font-bold text-base">{method.label}</span>
                                  <span className="text-xs text-muted-foreground mt-1 text-center">{method.desc}</span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Additional field for MFS */}
                  {["bkash", "rocket", "nagad"].includes(selectedMethod) && (
                    <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-dashed">
                      <FormField
                        control={form.control}
                        name="paymentNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>যে নম্বর থেকে টাকা পাঠিয়েছেন</FormLabel>
                            <FormControl>
                              <Input placeholder="01XXXXXXXXX" {...field} data-testid="input-payment-number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        প্রথমে উপরের নম্বরে টাকা Send Money করুন, তারপর যে নম্বর থেকে পাঠিয়েছেন সেটি এখানে দিন।
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-card rounded-2xl p-6 border shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b">অর্ডারের সারসংক্ষেপ</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">উপমোট (১টি আইটেম)</span>
                  <span className="font-medium">৳২৫০</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">ডেলিভারি চার্জ</span>
                  <span className="font-medium">৳৬০</span>
                </div>
                <div className="flex justify-between items-center text-sm text-green-600">
                  <span>ডিসকাউন্ট</span>
                  <span>-৳২০</span>
                </div>
                
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-bold text-lg">সর্বমোট</span>
                  <span className="font-bold text-2xl text-primary font-mono">৳২৯০</span>
                </div>
              </div>

              <div className="bg-primary/5 rounded-xl p-4 mb-6 flex items-start gap-3 text-sm text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p>আপনার তথ্য সম্পূর্ণ নিরাপদ। আমরা কোনো পেমেন্ট ইনফরমেশন সেভ করে রাখি না।</p>
              </div>

              <Button 
                type="submit" 
                form="checkout-form" 
                className="w-full h-14 text-lg font-bold shadow-md"
                disabled={createOrder.isPending}
                data-testid="button-place-order"
              >
                {createOrder.isPending ? "প্রসেসিং..." : "অর্ডার কনফার্ম করুন"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
