/**
 * Email notifications via Resend API
 * Called internally by Workers routes when key events occur.
 *
 * Events triggered:
 *  - Invoice overdue / past due
 *  - Legal status changes to 'review' or 'pending'
 *  - New document added with missing status
 */

export type EmailPayload = {
  to:      string | string[]
  subject: string
  html:    string
}

export async function sendEmail(payload: EmailPayload, apiKey: string): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      from:    'NLP Portal <portal@nlpgroup.com.vn>',
      to:      Array.isArray(payload.to) ? payload.to : [payload.to],
      subject: payload.subject,
      html:    payload.html,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error(`[email] send failed: ${err}`)
    // Non-fatal — log but don't throw (email is best-effort)
  }
}

// ─── Email templates ──────────────────────────────────────────────────────────
export function invoiceOverdueEmail(params: {
  invoiceId: string; projectName: string; amount: string; dueDate: string
}): EmailPayload {
  return {
    to:      'finance@nlpgroup.com.vn',
    subject: `⚠️ Hoá đơn quá hạn: ${params.invoiceId} – ${params.projectName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#dc2626">⚠️ Hoá đơn quá hạn thanh toán</h2>
        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          <tr><td style="padding:8px;color:#6b7280">Mã hoá đơn</td><td style="padding:8px;font-weight:600">${params.invoiceId}</td></tr>
          <tr><td style="padding:8px;color:#6b7280">Dự án</td><td style="padding:8px">${params.projectName}</td></tr>
          <tr><td style="padding:8px;color:#6b7280">Số tiền</td><td style="padding:8px;font-weight:600;color:#dc2626">${params.amount}</td></tr>
          <tr><td style="padding:8px;color:#6b7280">Đến hạn</td><td style="padding:8px">${params.dueDate}</td></tr>
        </table>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">Vui lòng xử lý kịp thời. — NLP Group Portal</p>
      </div>
    `,
  }
}

export function legalAlertEmail(params: {
  projectId: string; projectName: string; legalStatus: string; note: string
}): EmailPayload {
  return {
    to:      'legal@nlpgroup.com.vn',
    subject: `⚖️ Cảnh báo pháp lý: ${params.projectId} – ${params.projectName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#d97706">⚖️ Dự án cần xử lý pháp lý</h2>
        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          <tr><td style="padding:8px;color:#6b7280">Mã dự án</td><td style="padding:8px;font-weight:600">${params.projectId}</td></tr>
          <tr><td style="padding:8px;color:#6b7280">Dự án</td><td style="padding:8px">${params.projectName}</td></tr>
          <tr><td style="padding:8px;color:#6b7280">Trạng thái pháp lý</td><td style="padding:8px;font-weight:600;color:#d97706">${params.legalStatus}</td></tr>
          <tr><td style="padding:8px;color:#6b7280">Ghi chú</td><td style="padding:8px">${params.note}</td></tr>
        </table>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">Vui lòng kiểm tra hồ sơ. — NLP Group Portal</p>
      </div>
    `,
  }
}
