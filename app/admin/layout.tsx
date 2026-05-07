import SidebarNav from './sidebar-nav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[9999] flex" style={{ backgroundColor: '#F7F7F7' }}>
      <SidebarNav />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
