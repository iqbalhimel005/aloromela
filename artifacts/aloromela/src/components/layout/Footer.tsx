import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-row gap-8">
          <div className="space-y-4" style={{width: 'calc(33.333% + 30px)', flexShrink: 0}}>
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-primary">আলোরমেলা</span>
            </Link>
            <div className="text-muted-foreground text-base space-y-1">
              <p>বই পড়ি, নিই জাতি গড়ার শপথ।</p>
              <p>আলোকিত জাতি, সমৃদ্ধ ভবিষ্যৎ।</p>
              <p>বাংলাদেশের সবচেয়ে বিশ্বস্ত</p>
              <p>অনলাইন বুকশপ।</p>
            </div>
          </div>

          <div style={{marginLeft: '-15px', flexShrink: 0, width: 'fit-content'}}>
            <h3 className="font-semibold text-lg mb-4 text-foreground whitespace-nowrap">গুরুত্বপূর্ণ লিংক</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/books" className="text-muted-foreground hover:text-primary transition-colors text-base whitespace-nowrap">সব বই</Link>
              </li>
              <li>
                <Link href="/offers" className="text-muted-foreground hover:text-primary transition-colors text-base whitespace-nowrap">অফার সমূহ</Link>
              </li>
              <li>
                <Link href="/sell-book" className="text-muted-foreground hover:text-primary transition-colors text-base whitespace-nowrap">পুরাতন বই বিক্রি করুন</Link>
              </li>
              <li>
                <Link href="/book-request" className="text-muted-foreground hover:text-primary transition-colors text-base whitespace-nowrap">বইয়ের জন্য রিকোয়েস্ট</Link>
              </li>
            </ul>
          </div>

          <div className="flex-1" style={{marginLeft: '15px'}}>
            <h3 className="font-semibold text-lg mb-4 text-foreground">যোগাযোগ</h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-2 text-base text-muted-foreground">
              <span className="font-bold text-foreground">ইমেইল:</span>
              <span>support@alormelabd.com</span>
              <span></span>
              <span>mahfujsirphysics@gmail.com</span>
              <span className="font-bold text-foreground">মোবাইল:</span>
              <span>017 24 24 93 93 (মাহফুজ স্যার)</span>
              <span className="font-bold text-foreground">ঠিকানা:</span>
              <span>শিমুলিয়া, পাকুন্দিয়া, কিশোরগঞ্জ</span>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-base text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} আলোরমেলা. সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
}
