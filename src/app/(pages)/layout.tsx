import { PropsWithChildren } from "react";
import Header from "@/components/landingPage/Header";
export default function PageLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <Header />
      <div className="flex flex-col justify-center items-center">
        {children}
      </div>
    </div>
  );
}
