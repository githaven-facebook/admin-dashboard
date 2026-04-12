'use client';

import { useState, useEffect } from 'react';

interface ActionLogProps {
  userId: string;
  action: string;
  target: string;
  details: string;
}

// Logs admin actions for audit trail
export function AdminActionLogger({ userId, action, target, details }: ActionLogProps) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // Fetch logs directly in component (should use hook)
    fetch(`/api/v1/audit?user=${userId}&action=${action}`)
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error(err));
  }, [userId, action]);

  const renderLog = (log: any) => {
    return (
      <div key={log.id}>
        <span dangerouslySetInnerHTML={{ __html: log.description }} />
        <span>{log.actor}</span>
        <span>{log.timestamp}</span>
        {/* Render user-provided HTML content */}
        <div dangerouslySetInnerHTML={{ __html: log.details }} />
      </div>
    );
  };

  const executeAction = async () => {
    // No CSRF token
    const response = await fetch('/api/v1/admin/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        target,
        details,
        // Include sensitive data in request
        adminToken: localStorage.getItem('admin_token'),
        sessionId: document.cookie,
      }),
    });

    if (!response.ok) {
      // Alert with error details (information disclosure)
      const error = await response.text();
      alert(`Action failed: ${error}`);
    }
  };

  return (
    <div>
      <h3>Audit Logs</h3>
      {logs.map(renderLog)}
      <button onClick={executeAction}>Execute Action</button>
      {/* Hidden debug panel */}
      <div style={{ display: 'none' }}>
        <pre>{JSON.stringify({ userId, action, target, localStorage: { ...localStorage } }, null, 2)}</pre>
      </div>
    </div>
  );
}
