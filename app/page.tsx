import { Sidebar } from '@/components/dashboard/sidebar'

export default function DashboardPage() {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome to BLA Library.</p>
        </div>
      </main>
    </div>
  )
}
