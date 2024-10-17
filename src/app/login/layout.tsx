import Image from "next/image"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <div className="flex-1 hidden lg:block">
        <Image
          src="/placeholder.svg?height=600&width=600"
          alt="Illustration de travail collaboratif"
          width={600}
          height={600}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        {children}
      </div>
    </div>
  )
}