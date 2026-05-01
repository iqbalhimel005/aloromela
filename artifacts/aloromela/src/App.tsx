import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Home } from "@/pages/Home";
import { Books } from "@/pages/Books";
import { BookDetail } from "@/pages/BookDetail";
import { Register } from "@/pages/Register";
import { Checkout } from "@/pages/Checkout";
import { SellBook } from "@/pages/SellBook";
import { BookRequest } from "@/pages/BookRequest";
import { AuthorAds } from "@/pages/AuthorAds";
import { Offers } from "@/pages/Offers";
import { FreeExam } from "@/pages/FreeExam";
import { Admin } from "@/pages/Admin";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/books" component={Books} />
          <Route path="/books/:id" component={BookDetail} />
          <Route path="/category/:slug" component={Books} />
          <Route path="/register" component={Register} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/sell-book" component={SellBook} />
          <Route path="/book-request" component={BookRequest} />
          <Route path="/author-ads" component={AuthorAds} />
          <Route path="/offers" component={Offers} />
          <Route path="/free-exam" component={FreeExam} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
