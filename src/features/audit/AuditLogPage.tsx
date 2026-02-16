
import React, { useEffect, useState } from 'react';
import api from '../../core/api';
import type { AuditLog } from '../../types';
import { Clock, User as UserIcon, Activity } from 'lucide-react';

export const AuditLogPage: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get<AuditLog[]>('/audit-log');
                setLogs(res.data);
            } catch (err) {
                console.error('Failed to fetch audit logs');
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>

            <div className="bg-white shadow-sm overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Loading logs...</td>
                            </tr>
                        ) : logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                                    <Clock size={16} />
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <UserIcon size={16} className="text-gray-400" />
                                        {log.userId}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                                        log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                                    <Activity size={16} />
                                    {log.resourceType} {log.resourceId ? `(${log.resourceId})` : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
