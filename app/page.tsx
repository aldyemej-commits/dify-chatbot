'use client';
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{role:string, content:string}[]>([
    { role: 'bot', content: '안녕하세요. 무엇을 도와드릴까요?' }
  ]);
  const [input, setInput] = useState('');
  const [convId, setConvId] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg, conversationId: convId }),
    });
    const data = await res.json();
    setConvId(data.conversationId);
    setMessages(prev => [...prev, { role: 'bot', content: data.answer }]);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h2 style={{ marginBottom: 24 }}>Brand Assistant</h2>
      <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 20, minHeight: 400, maxHeight: 500, overflowY: 'auto', marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 12, textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <span style={{ background: m.role === 'user' ? '#1a1a1a' : '#f5f5f5', color: m.role === 'user' ? '#fff' : '#000', padding: '8px 14px', borderRadius: 18, display: 'inline-block', maxWidth: '80%' }}>
              {m.content}
            </span>
          </div>
        ))}
        {loading && <div style={{ color: '#999', fontSize: 13 }}>입력 중...</div>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="메시지를 입력하세요..."
          style={{ flex: 1, padding: '10px 14px', borderRadius: 20, border: '1px solid #ddd', fontSize: 14 }}
        />
        <button onClick={send} style={{ padding: '10px 20px', borderRadius: 20, background: '#1a1a1a', color: '#fff', border: 'none', cursor: 'pointer' }}>
          전송
        </button>
      </div>
    </div>
  );
}