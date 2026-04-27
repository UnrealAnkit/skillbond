import Image from 'next/image';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin Login | SkillBond',
};

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If already logged in, check if they are admin to redirect away from login
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin') {
      redirect('/admin');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#080B0F]">
      <div className="w-full max-w-md mb-8 text-center">
        <Image src="/skillbonglogosvg.svg?v=20260427" alt="SkillBond Logo" width={440} height={440} className="mx-auto h-44 w-auto sm:h-48 object-contain mb-3" unoptimized priority />
        <p className="text-zinc-400">Secure Administration Portal</p>
      </div>
      <AdminLoginForm />
    </div>
  );
}