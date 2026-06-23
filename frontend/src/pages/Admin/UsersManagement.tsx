import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, ShieldAlert, Award } from 'lucide-react';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  ordersCount: number;
}

export const UsersManagement: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<MockUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API request to fetch user database
    const loadUsers = () => {
      setLoading(true);
      setTimeout(() => {
        const mockUsers: MockUser[] = [
          {
            id: 'usr_admin',
            name: 'مدير النظام رئيسي',
            email: 'admin@mshabar.com',
            phone: '01012345678',
            role: 'admin',
            ordersCount: 0
          },
          {
            id: 'usr_customer',
            name: 'أحمد علي',
            email: 'user@mshabar.com',
            phone: '01234567890',
            role: 'customer',
            ordersCount: 5
          },
          {
            id: 'usr_3',
            name: 'منى أحمد',
            email: 'mona@gmail.com',
            phone: '01556789012',
            role: 'customer',
            ordersCount: 2
          },
          {
            id: 'usr_4',
            name: 'كريم محمود',
            email: 'karim@outlook.com',
            phone: '01123456789',
            role: 'customer',
            ordersCount: 12
          }
        ];
        setUsers(mockUsers);
        setLoading(false);
      }, 400);
    };
    loadUsers();
  }, []);

  const toggleUserRole = (id: string, name: string, currentRole: 'admin' | 'customer') => {
    const nextRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`هل أنت متأكد من تغيير دور "${name}" إلى ${nextRole === 'admin' ? 'مشرف' : 'زبون'}؟`)) return;

    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: nextRole } : u));
    showToast(`تم تغيير صلاحية العميل "${name}" إلى ${nextRole === 'admin' ? 'مشرف' : 'زبون'}!`, 'success');
  };

  return (
    <div className="text-right">
      <Helmet>
        <title>لوحة التحكم | إدارة المستخدمين</title>
      </Helmet>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <Users className="w-7 h-7 text-brand-orange-500" />
          <span>إدارة حسابات المستخدمين</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">تصفح وتعديل صلاحيات العملاء والمشرفين على النظام</p>
      </div>

      {loading ? (
        <Loader text="جاري تحميل حسابات المستخدمين..." />
      ) : (
        /* Users table */
        <div className="bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold">
                  <th className="p-5">الاسم</th>
                  <th className="p-5">البريد الإلكتروني</th>
                  <th className="p-5">رقم الهاتف</th>
                  <th className="p-5">الصلاحية</th>
                  <th className="p-5 text-center">الطلبات المسلمة</th>
                  <th className="p-5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-black">
                        {u.name[0]}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="p-5">{u.email}</td>
                    <td className="p-5 number-font" dir="ltr">{u.phone}</td>
                    <td className="p-5">
                      {u.role === 'admin' ? (
                        <Badge variant="danger" size="sm">مشرف النظام</Badge>
                      ) : (
                        <Badge variant="slate" size="sm">زبون</Badge>
                      )}
                    </td>
                    <td className="p-5 text-center number-font">{u.ordersCount} طلبات</td>
                    <td className="p-5">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => toggleUserRole(u.id, u.name, u.role)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                            u.role === 'admin'
                              ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
                              : 'bg-teal-50 text-brand-green-600 border-brand-green-100 hover:bg-brand-green-100'
                          }`}
                        >
                          {u.role === 'admin' ? (
                            <>
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>خفض الرتبة لزبون</span>
                            </>
                          ) : (
                            <>
                              <Award className="w-3.5 h-3.5" />
                              <span>ترقية لمشرف</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
export default UsersManagement;
