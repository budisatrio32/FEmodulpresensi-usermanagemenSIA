import Image from "next/image";
import Navbar from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/footer";
import LoginForm from "@/components/ui/loginform";

export default function Home() {
  return (
    <div className="bg-brand-light-sage">
      <Navbar />
      <LoginForm />
      <div className="container mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold text-brand-green mb-6">Button Examples</h1>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="warning">Warning Button</Button>
          <Button variant="success">Success Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}