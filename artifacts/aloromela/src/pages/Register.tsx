import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRegisterCustomer, useVerifyOtp, useSendOtp } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, UserPlus, Smartphone } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const registerSchema = z.object({
  name: z.string().min(2, { message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে" }),
  mobile: z.string().regex(/^01[3-9]\d{8}$/, { message: "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন" }),
  district: z.string().min(2, { message: "জেলার নাম দিন" }),
  upazila: z.string().min(2, { message: "উপজেলার নাম দিন" }),
  postOffice: z.string().optional(),
  village: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [step, setStep] = useState<"register" | "otp">("register");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [demoOtp, setDemoOtp] = useState("");

  const registerCustomer = useRegisterCustomer();
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      mobile: "",
      district: "",
      upazila: "",
      postOffice: "",
      village: "",
    },
  });

  const onSubmitRegister = (data: RegisterFormValues) => {
    registerCustomer.mutate(
      { data },
      {
        onSuccess: () => {
          setMobileNumber(data.mobile);
          // After successful registration, send OTP
          sendOtp.mutate(
            { data: { mobile: data.mobile } },
            {
              onSuccess: (response) => {
                setStep("otp");
                if (response.otp) {
                  setDemoOtp(response.otp);
                  toast({
                    title: "ডেমো মোড",
                    description: `আপনার OTP: ${response.otp}`,
                    duration: 10000,
                  });
                } else {
                  toast({
                    title: "OTP পাঠানো হয়েছে",
                    description: `${data.mobile} নম্বরে একটি কোড পাঠানো হয়েছে।`,
                  });
                }
              },
              onError: (error) => {
                toast({
                  variant: "destructive",
                  title: "ত্রুটি",
                  description: "OTP পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
                });
              }
            }
          );
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: error.message || "রেজিস্ট্রেশনে সমস্যা হয়েছে।",
          });
        }
      }
    );
  };

  const handleVerifyOtp = () => {
    if (otpValue.length !== 4) {
      toast({
        variant: "destructive",
        title: "ত্রুটি",
        description: "৪ ডিজিটের সঠিক পিন দিন",
      });
      return;
    }

    verifyOtp.mutate(
      { data: { mobile: mobileNumber, otp: otpValue } },
      {
        onSuccess: (res) => {
          toast({
            title: "সফল",
            description: "আপনার একাউন্ট সফলভাবে ভেরিফাই হয়েছে।",
          });
          setLocation("/");
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "ভুল পিন",
            description: "আপনি ভুল পিন দিয়েছেন। আবার চেষ্টা করুন।",
          });
        }
      }
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-muted/20 py-12 px-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-sm border overflow-hidden">
        <div className="bg-primary/5 p-6 border-b text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            {step === "register" ? (
              <UserPlus className="w-8 h-8 text-primary" />
            ) : (
              <Smartphone className="w-8 h-8 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {step === "register" ? "নতুন একাউন্ট খুলুন" : "নম্বর ভেরিফাই করুন"}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {step === "register" 
              ? "নিচের তথ্যগুলো দিয়ে আলোরমেলায় যুক্ত হোন" 
              : `${mobileNumber} নম্বরে পাঠানো ৪ ডিজিটের পিনটি দিন`}
          </p>
        </div>

        <div className="p-6 md:p-8">
          {step === "register" ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitRegister)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>আপনার নাম <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="যেমন: রহিম মিয়া" {...field} data-testid="input-name" />
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
                        <Input placeholder="যেমন: 01XXXXXXXXX" type="tel" {...field} data-testid="input-mobile" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>জেলা <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="যেমন: ঢাকা" {...field} data-testid="input-district" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="upazila"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>উপজেলা/থানা <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="যেমন: মিরপুর" {...field} data-testid="input-upazila" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="postOffice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>পোস্ট অফিস</FormLabel>
                        <FormControl>
                          <Input placeholder="ঐচ্ছিক" {...field} data-testid="input-post" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="village"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>গ্রাম/মহল্লা</FormLabel>
                        <FormControl>
                          <Input placeholder="ঐচ্ছিক" {...field} data-testid="input-village" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full mt-6 h-12 text-base font-semibold" 
                  disabled={registerCustomer.isPending || sendOtp.isPending}
                  data-testid="button-submit-register"
                >
                  {registerCustomer.isPending || sendOtp.isPending ? "অপেক্ষা করুন..." : "একাউন্ট তৈরি করুন"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-6 flex flex-col items-center">
              {demoOtp && (
                <Alert className="bg-primary/5 border-primary/20 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>ডেমো OTP</AlertTitle>
                  <AlertDescription>পরীক্ষার জন্য OTP: <strong>{demoOtp}</strong></AlertDescription>
                </Alert>
              )}
              
              <div className="pt-4">
                <InputOTP 
                  maxLength={4} 
                  value={otpValue}
                  onChange={(val) => setOtpValue(val)}
                  data-testid="input-otp"
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="w-14 h-14 text-2xl font-bold border-2 rounded-md" />
                    <InputOTPSlot index={1} className="w-14 h-14 text-2xl font-bold border-2 rounded-md" />
                    <InputOTPSlot index={2} className="w-14 h-14 text-2xl font-bold border-2 rounded-md" />
                    <InputOTPSlot index={3} className="w-14 h-14 text-2xl font-bold border-2 rounded-md" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button 
                onClick={handleVerifyOtp}
                className="w-full h-12 text-base font-semibold mt-4" 
                disabled={otpValue.length !== 4 || verifyOtp.isPending}
                data-testid="button-verify-otp"
              >
                {verifyOtp.isPending ? "ভেরিফাই করা হচ্ছে..." : "ভেরিফাই করুন"}
              </Button>
              
              <Button 
                variant="link" 
                className="text-muted-foreground"
                onClick={() => setStep("register")}
              >
                নম্বর পরিবর্তন করুন
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
