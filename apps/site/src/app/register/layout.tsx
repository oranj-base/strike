import { Toaster } from 'react-hot-toast';

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
      <Toaster />
    </section>
  );
}
