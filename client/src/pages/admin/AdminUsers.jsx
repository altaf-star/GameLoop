import AdminLayout from '../../components/AdminLayout.jsx';
import ContactCell from '../../components/ContactCell.jsx';
import { useApi } from '../../hooks/useApi';
import Loading from '../../components/Loading.jsx';
import Reveal from '../../components/Reveal.jsx';

function fmt(d) { return new Date(d).toLocaleDateString(); }

export default function AdminUsers() {
  const { data: users, loading } = useApi('/admin/users');
  return (
    <AdminLayout title="Users">
      {loading ? <Loading /> : (
        <Reveal><div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ps-surface text-ps-muted">
              <tr className="text-left">
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users?.map(u => (
                <tr key={u._id} className="border-t border-ps-border align-top">
                  <td className="px-4 py-3"><ContactCell user={u} /></td>
                  <td className="px-4 py-3">
                    <span className={u.role === 'admin' ? 'badge-info' : 'badge'}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-ps-muted">{fmt(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></Reveal>
      )}
    </AdminLayout>
  );
}
