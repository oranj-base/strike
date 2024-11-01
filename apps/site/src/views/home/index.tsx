'use client';

import Header from './Header';
import Demo from './Demo';
import Step from './Step';
import Feature from './Feature';
import Footer from './Footer';

export function Home() {
  return (
    <div>
      <main className="container max-w-[1440px] mx-auto font-inter ">
        <Header />
        <Step />
        <Feature />
        <Demo />
        <Footer />
      </main>
    </div>
  );
}
