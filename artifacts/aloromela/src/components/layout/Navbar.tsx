import { Link } from "wouter";
import { Menu, Search, ShoppingCart, User, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import {
  SCHOOL_CLASSES,
  COLLEGE_GROUPS,
  DEGREE_YEARS,
  HONOURS_SUBJECTS,
  HONOURS_YEARS,
  getHonoursSlug,
} from "@/lib/categories";

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick}>
      <span className="block select-none rounded-md p-3 text-sm font-medium leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
        {label}
      </span>
    </Link>
  );
}

function HonoursPanel({ onClose }: { onClose?: () => void }) {
  const [selectedSubject, setSelectedSubject] = useState(HONOURS_SUBJECTS[0].slug);
  const subject = HONOURS_SUBJECTS.find(s => s.slug === selectedSubject)!;

  return (
    <div className="flex w-[560px]">
      <div className="w-44 border-r pr-2 py-2 bg-muted/30">
        <div className="text-xs font-bold text-muted-foreground px-3 pb-2">বিষয় নির্বাচন করুন</div>
        <ul className="space-y-0.5">
          {HONOURS_SUBJECTS.map(s => (
            <li key={s.slug}>
              <button
                onMouseEnter={() => setSelectedSubject(s.slug)}
                onClick={() => setSelectedSubject(s.slug)}
                className={`w-full text-left px-3 py-1.5 rounded-md text-sm flex items-center justify-between transition-colors ${
                  selectedSubject === s.slug
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-accent"
                }`}
              >
                <span>{s.label}</span>
                <ChevronRight className="h-3 w-3 opacity-50" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 pl-3 py-2">
        <div className="text-xs font-bold text-muted-foreground px-2 pb-2">{subject.label}</div>
        <div className="mb-2">
          <div className="text-xs text-muted-foreground px-2 pb-1 font-semibold">— অনার্স —</div>
          {HONOURS_YEARS.filter(y => y.suffix.startsWith("year")).map(y => (
            <NavLink
              key={y.suffix}
              href={`/category/${getHonoursSlug(subject.slug, y.suffix)}`}
              label={y.label}
              onClick={onClose}
            />
          ))}
        </div>
        <div>
          <div className="text-xs text-muted-foreground px-2 pb-1 font-semibold">— মাস্টার্স —</div>
          {HONOURS_YEARS.filter(y => y.suffix.startsWith("masters")).map(y => (
            <NavLink
              key={y.suffix}
              href={`/category/${getHonoursSlug(subject.slug, y.suffix)}`}
              label={y.label}
              onClick={onClose}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileAccordionItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-base font-semibold py-2 hover:text-primary transition-colors"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pl-3 pb-2 space-y-0.5">{children}</div>}
    </div>
  );
}

function MobileHonoursAccordion({ onClose }: { onClose: () => void }) {
  return (
    <MobileAccordionItem label="অনার্স / মাস্টার্স">
      {HONOURS_SUBJECTS.map(s => (
        <MobileAccordionItem key={s.slug} label={s.label}>
          <div className="pl-2">
            <div className="text-xs text-muted-foreground py-1 font-semibold">অনার্স</div>
            {HONOURS_YEARS.filter(y => y.suffix.startsWith("year")).map(y => (
              <Link
                key={y.suffix}
                href={`/category/${getHonoursSlug(s.slug, y.suffix)}`}
                onClick={onClose}
                className="block py-1.5 px-2 text-sm rounded hover:bg-accent hover:text-accent-foreground"
              >
                {y.label}
              </Link>
            ))}
            <div className="text-xs text-muted-foreground py-1 font-semibold mt-1">মাস্টার্স</div>
            {HONOURS_YEARS.filter(y => y.suffix.startsWith("masters")).map(y => (
              <Link
                key={y.suffix}
                href={`/category/${getHonoursSlug(s.slug, y.suffix)}`}
                onClick={onClose}
                className="block py-1.5 px-2 text-sm rounded hover:bg-accent hover:text-accent-foreground"
              >
                {y.label}
              </Link>
            ))}
          </div>
        </MobileAccordionItem>
      ))}
    </MobileAccordionItem>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-6">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] sm:w-[380px] overflow-y-auto">
              <nav className="flex flex-col gap-1 mt-8 px-1">
                <Link href="/" onClick={closeMenu} className="text-base font-semibold hover:text-primary transition-colors py-2">হোম</Link>
                <Link href="/books" onClick={closeMenu} className="text-base font-semibold hover:text-primary transition-colors py-2">সব বই</Link>

                <MobileAccordionItem label="স্কুল">
                  {SCHOOL_CLASSES.map(c => (
                    <Link key={c.slug} href={`/category/${c.slug}`} onClick={closeMenu} className="block py-1.5 px-2 text-sm rounded hover:bg-accent">
                      {c.label}
                    </Link>
                  ))}
                </MobileAccordionItem>

                <MobileAccordionItem label="কলেজ">
                  {COLLEGE_GROUPS.map(c => (
                    <Link key={c.slug} href={`/category/${c.slug}`} onClick={closeMenu} className="block py-1.5 px-2 text-sm rounded hover:bg-accent">
                      {c.label}
                    </Link>
                  ))}
                </MobileAccordionItem>

                <MobileAccordionItem label="ডিগ্রি">
                  {DEGREE_YEARS.map(c => (
                    <Link key={c.slug} href={`/category/${c.slug}`} onClick={closeMenu} className="block py-1.5 px-2 text-sm rounded hover:bg-accent">
                      {c.label}
                    </Link>
                  ))}
                </MobileAccordionItem>

                <MobileHonoursAccordion onClose={closeMenu} />

                <Link href="/category/job" onClick={closeMenu} className="text-base font-semibold hover:text-primary transition-colors py-2">চাকরি</Link>
                <Link href="/category/novel" onClick={closeMenu} className="text-base font-semibold hover:text-primary transition-colors py-2">উপন্যাস</Link>
                <Link href="/category/story-poem" onClick={closeMenu} className="text-base font-semibold hover:text-primary transition-colors py-2">গল্প কবিতা</Link>
                <Link href="/category/pdf" onClick={closeMenu} className="text-base font-semibold hover:text-primary transition-colors py-2">পিডিএফ</Link>
                <Link href="/sell-book" onClick={closeMenu} className="text-base font-semibold hover:text-primary transition-colors py-2">বই বিক্রি</Link>
                <Link href="/author-ads" onClick={closeMenu} className="text-base font-semibold hover:text-primary transition-colors py-2">নতুন লেখক</Link>
                <Link href="/offers" onClick={closeMenu} className="text-base font-semibold hover:text-primary transition-colors text-primary py-2">অফার সমূহ</Link>
                <Link href="/free-exam" onClick={closeMenu} className="text-base font-semibold hover:text-emerald-600 transition-colors text-emerald-600 py-2">📝 ফ্রি পরীক্ষা প্রস্তুতি</Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <span className="text-2xl font-bold text-primary tracking-tight">আলোরমেলা</span>
          </Link>

          <div className="hidden lg:flex">
            <NavigationMenu>
              <NavigationMenuList>

                {/* স্কুল */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-sm">স্কুল</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-[340px]">
                      <div className="text-xs font-bold text-muted-foreground mb-3">শ্রেণি অনুযায়ী বই</div>
                      <ul className="grid grid-cols-2 gap-1">
                        {SCHOOL_CLASSES.map(c => (
                          <li key={c.slug}>
                            <NavLink href={`/category/${c.slug}`} label={c.label} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* কলেজ */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-sm">কলেজ</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-[220px]">
                      <div className="text-xs font-bold text-muted-foreground mb-3">বিভাগ অনুযায়ী বই</div>
                      <ul className="space-y-1">
                        {COLLEGE_GROUPS.map(c => (
                          <li key={c.slug}>
                            <NavLink href={`/category/${c.slug}`} label={c.label} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* ডিগ্রি */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-sm">ডিগ্রি</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-[220px]">
                      <div className="text-xs font-bold text-muted-foreground mb-3">বর্ষ অনুযায়ী বই</div>
                      <ul className="space-y-1">
                        {DEGREE_YEARS.map(c => (
                          <li key={c.slug}>
                            <NavLink href={`/category/${c.slug}`} label={c.label} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* অনার্স / মাস্টার্স */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-sm">অনার্স/মাস্টার্স</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <HonoursPanel />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/category/job">
                    <span className={navigationMenuTriggerStyle() + " bg-transparent text-sm cursor-pointer"}>চাকরি</span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/category/novel">
                    <span className={navigationMenuTriggerStyle() + " bg-transparent text-sm cursor-pointer"}>উপন্যাস</span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/category/story-poem">
                    <span className={navigationMenuTriggerStyle() + " bg-transparent text-sm cursor-pointer"}>গল্প কবিতা</span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/category/pdf">
                    <span className={navigationMenuTriggerStyle() + " bg-transparent text-sm cursor-pointer"}>পিডিএফ</span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/sell-book">
                    <span className={navigationMenuTriggerStyle() + " bg-transparent text-sm cursor-pointer"}>বই বিক্রি</span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/free-exam">
                    <span className={navigationMenuTriggerStyle() + " bg-transparent text-sm cursor-pointer font-semibold text-emerald-600 hover:text-emerald-700"}>📝 ফ্রি পরীক্ষা</span>
                  </Link>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden md:block w-[220px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="বই খুঁজুন..."
              className="w-full pl-9 rounded-full bg-muted/50 border-none focus-visible:ring-primary"
              data-testid="input-search"
            />
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-search-mobile">
            <Search className="h-5 w-5" />
          </Button>
          <Link href="/register">
            <Button variant="ghost" size="icon" data-testid="button-account">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/checkout">
            <Button variant="outline" size="icon" className="relative rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary" data-testid="button-cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-medium">
                0
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
