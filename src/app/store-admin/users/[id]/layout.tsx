import Link from "next/link"
import { getStoreUserById } from "@/data"
import { Header } from "@/components/layout/header"

interface Props {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function UserDetailLayout({ children, params }: Props) {
  const { id } = await params
  const user = getStoreUserById(id)

  const userName = user ? `${user.firstName} ${user.lastName}` : "User"

  return (
    <>
      <Header />

      <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
        <div className="space-y-0.5">
          <div className="text-muted-foreground text-sm">
            <Link
              href="/store-admin/users"
              className="hover:text-foreground transition-colors"
            >
              Users
            </Link>
            {" › "}
            <span className="text-foreground">{userName}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            View admin&apos;s profile
          </h1>
        </div>
        <div className="flex flex-1 flex-col overflow-auto">{children}</div>
      </div>
    </>
  )
}
