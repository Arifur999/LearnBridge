import { Navbar } from "@/components/ui/shared/navbar1";


export default function commonLayout({children} : {children : React.ReactNode}) {
  return (
    <div className="">
        <Navbar></Navbar>
        {children}
    </div>
  )
}
