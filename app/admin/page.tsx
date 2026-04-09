import { checkAdmin, getAdminStats, getUsers, getBondsWithDetails } from '@/actions/admin';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata = {
  title: 'Admin Dashboard | SkillBond',
};

export default async function AdminPage() {
  // Check auth and admin role
  await checkAdmin();

  // Fetch all necessary admin data
  const [stats, users, bonds] = await Promise.all([
    getAdminStats(),
    getUsers(),
    getBondsWithDetails(),
  ]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <AdminDashboard stats={stats} users={users} bonds={bonds} />
    </div>
  );
}

