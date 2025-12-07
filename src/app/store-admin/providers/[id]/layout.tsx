import Link from "next/link"
import { getProviderById, getProviderFullName } from "@/data"
import { Header } from "@/components/layout/header"

interface Props {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function ProviderDetailLayout({
  children,
  params,
}: Props) {
  const { id } = await params
  const provider = getProviderById(id)

  const providerName = provider
    ? `${provider.firstName} ${provider.lastName}`
    : "Provider"

  return (
    <>
      <Header />

      <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
        <div className="space-y-0.5">
          <div className="text-muted-foreground text-sm">
            <Link
              href="/store-admin/providers"
              className="hover:text-foreground transition-colors"
            >
              Providers
            </Link>
            {" › "}
            <span className="text-foreground">{providerName}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            View doctor&apos;s profile
          </h1>
        </div>
        <div className="flex flex-1 flex-col overflow-auto">{children}</div>
      </div>
    </>
  )
}
