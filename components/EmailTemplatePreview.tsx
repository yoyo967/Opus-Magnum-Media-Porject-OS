import React from 'react';

interface EmailTemplatePreviewProps {
    subject?: string;
    body?: string;
    onSubjectChange: (newSubject: string) => void;
    onBodyChange: (newBody: string) => void;
}

export const EmailTemplatePreview: React.FC<EmailTemplatePreviewProps> = ({ subject, body, onSubjectChange, onBodyChange }) => {
    const heroImageSVG = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDYwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8c3R5bGU+CiAgICAgICAgQGtleWZyYW1lcyBzdWJ0bGVHbG93IHsKICAgICAgICAgICAgMCUsIDEwMCUgewogICAgICAgICAgICAgICAgZmlsdGVyOiBkcm9wLXNoYWRvdygwIDAgMnB4IHJnYmEoMTczLCAyMTYsIDIzMCwgMC4yKSkgZHJvcC1zaGFkb3coMCAwIDJweCByZ2JhKDIyMSwgMTYwLCAyMjEsIDAuMikpOwogICAgICAgICAgICB9CiAgICAgICAgICAgIDUwJSB7CiAgICAgICAgICAgICAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KDAgMCA2cHggcmdiYSgxNzMsIDIxNiwgMjMwLCAwLjUpKSBkcm9wLXNoYWRvdygwIDAgNnB4IHJnYmEoMjIxLCAxNjAsIDIyMSwgMC41KSk7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgLnN1YnRsZUNsb3cgewogICAgICAgICAgICBhbmltYXRpb246IHN1YnRsZUNsb3cgNXMgZWFzZS1pbi1vdXQgaW5maW5pdGU7CiAgICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxkZWZzPgogICAgICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iYmctZ3JhZCIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgzMDAgMTIwKSByb3RhdGUoOTApIHNjYWxlKDI0MCA2MDApIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzEzMDEyOSIvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwQTBBMEEiLz4KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZC0xIiB4MT0iLTEwMCIgeTE9IjEyMCIgeDI9IjcwMCIgeTI9IjEyMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjOEEyQkUyIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjRkYwMEZGIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwN0JGRiIvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLTIiIHgxPSItMTAwIiB5MT0iMTIwIiB4Mj0iNzAwIiB5Mj0iMTIwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGRjAwRkYiLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwLjUiIHN0b3AtY29sb3I9IiMwMEJGRkYiLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDA3QkZGIi8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8ZmlsdGVyIGlkPSJnbG93IiB4PSItNTAlIiB5PSItNTAlIiB3aWR0aD0iMjAwJSIgaGVpZ2h0PSIyMDAlIj4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iNSIgcmVzdWx0PSJibHVyIi8+CiAgICAgICAgPC9maWx0ZXI+CiAgICA8L2RlZnM+CiAgICA8cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjI0MCIgZmlsbD0idXJsKCNiZy1ncmFkKSIvPgogICAgPGcgZmlsdGVyPSJ1cmwoI2dsb3cpIiBvcGFjaXR5PSIwLjciIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogc2NyZWVuIiBjbGFzcz0ic3VidGxlR2xvdyI+CiAgICAgICAgPHBhdGggZD0iTS0xMDAgMTIwIFEgNTAgLTEwMCwgMzAwIDEyMCBUIDcwMCAxMjAiIHN0cm9rZT0idXJsKCNncmFkLTEpIiBzdHJva2Utd2lkdGg9IjMiLz4KICAgICAgICA8cGF0aCBkPSJNLTEwMCAxMjAgUSA1MCAzNDAsIDMwMCAxMjAgVCA3MDAgMTIwIiBzdHJva2U9InVybCgjZ3JhZC0yKSIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgICA8L2c+CiAgICA8cGF0aCBkPSJNLTEwMCAxMjAgUSA1MCAtMTAwLCAzMDAgMTIwIFQgNzAwIDEyMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2Utb3BhY2l0eT0iMC44Ii8+CiAgICA8cGF0aCBkPSJNLTEwMCAxMjAgUSA1MCAzNDAsIDMwMCAxMjAgVCA3MDAgMTIwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iMzAwIiBjeT0iMTIwIiByPSI0IiBmaWxsPSJ3aGl0ZSIgZmlsdGVyPSJ1cmwoI2dsb3cpIiBjbGFzcz0ic3VidGxlR2xvdyIvPgogICAgPGNpcmNsZSBjeD0iODAiIGN5PSI2MCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNSIgY2xhc3M9InN1YnRsZUNsb3ciIC8+CiAgICA8Y2lyY2xlIGN4PSI1MjAiIGN5PSIxODAiIHI9IjIiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjMiIGNsYXNzPSJzdWJ0bGVHbG93IiAvPgo8L3N2Zz4=`;

    const defaultSubject = "Ihre E-Mail-Vorschau";
    const defaultBody = `<p style="color: #AAAAAA;">Der von der KI generierte Inhalt Ihrer E-Mail wird hier angezeigt.</p><p style="color: #AAAAAA;">Passen Sie die Eingaben im Editor an und klicken Sie auf "E-Mail erstellen", um eine Vorschau zu sehen.</p>`;

    return (
        <div id="email-print-area">
            <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] shadow-2xl max-w-[800px] mx-auto">
                <div className="bg-black/30 rounded-t-lg p-2 border-b border-white/10 flex items-center gap-2">
                    <div className="flex gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span></div>
                </div>
                <div className="bg-[#0A0A0A] overflow-hidden">
                    <div className="max-h-[70vh] overflow-y-auto">
                        <table width="100%" cellPadding="0" cellSpacing="0" border={0} style={{ backgroundColor: '#0A0A0A' }}>
                            <tbody>
                                <tr>
                                    <td align="center" style={{ fontFamily: "'Inter', sans-serif", padding: '20px' }}>
                                        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                                            <img style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px 8px 0 0' }} src={heroImageSVG} alt="Header" />
                                            <div style={{ backgroundColor: '#111111', padding: '32px', border: '1px solid #333', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
                                                <h1 contentEditable suppressContentEditableWarning onBlur={e => onSubjectChange(e.currentTarget.textContent || '')} style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 16px 0', outline: 'none', cursor: 'text' }}>
                                                    {subject || defaultSubject}
                                                </h1>
                                                <div data-editable-body contentEditable suppressContentEditableWarning onBlur={e => onBodyChange(e.currentTarget.innerHTML || '')} style={{ fontSize: '14px', lineHeight: 1.6, color: '#AAAAAA', margin: '0 0 16px 0', outline: 'none', cursor: 'text', minHeight: '100px' }} dangerouslySetInnerHTML={{ __html: body || defaultBody }} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
