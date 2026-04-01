const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { email, prenom } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'Prépa Brevet <onboarding@resend.dev>',
      to: [email],
      subject: 'Bienvenue sur Prépa Brevet ✦',
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;background:#EDEEF0;border-radius:16px;overflow:hidden">
          <div style="background:#0021BC;padding:32px 36px">
            <div style="font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:10px">prépa brevet</div>
            <div style="font-size:36px;font-weight:500;letter-spacing:-.04em;line-height:.95;text-transform:lowercase;color:#fff">
              bienvenue<br>${prenom || email.split('@')[0]} <span style="color:#EE6E34">!</span>
            </div>
          </div>
          <div style="background:#fff;padding:28px 36px">
            <p style="font-size:15px;color:#8A8DAA;font-weight:300;line-height:1.75;margin:0 0 24px">
              Ton compte est prêt. Tu peux maintenant générer ton premier brevet et commencer à préparer l'examen.
            </p>
            <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:28px">
              <div style="background:#EEF2FF;border-radius:10px;padding:12px 14px;display:flex;gap:12px;align-items:center">
                <div style="width:28px;height:28px;border-radius:7px;background:#0021BC;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">1</div>
                <div>
                  <div style="font-size:13px;font-weight:600;color:#0C447C">génère un brevet personnalisé</div>
                  <div style="font-size:11px;color:#185FA5;margin-top:2px">choisis la durée et les notions à travailler</div>
                </div>
              </div>
              <div style="background:#EEF2FF;border-radius:10px;padding:12px 14px;display:flex;gap:12px;align-items:center">
                <div style="width:28px;height:28px;border-radius:7px;background:#0021BC;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">2</div>
                <div>
                  <div style="font-size:13px;font-weight:600;color:#0C447C">suis ta progression</div>
                  <div style="font-size:11px;color:#185FA5;margin-top:2px">historique, radar des notions, badges</div>
                </div>
              </div>
              <div style="background:#FFF0E8;border-radius:10px;padding:12px 14px;display:flex;gap:12px;align-items:center;border:1.5px solid #EE6E34">
                <div style="width:28px;height:28px;border-radius:7px;background:#EE6E34;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">✦</div>
                <div>
                  <div style="font-size:13px;font-weight:600;color:#7C3D0E">ton brevet dans 87 jours</div>
                  <div style="font-size:11px;color:#854F0B;margin-top:2px">27 juin 2026 — prépare-toi maintenant</div>
                </div>
              </div>
            </div>
            <a href="https://prepabrevet.fr" style="display:inline-block;background:#0021BC;color:#fff;border-radius:100px;padding:14px 28px;font-size:13px;font-weight:600;text-decoration:none;text-transform:lowercase">
              accéder à la plateforme →
            </a>
          </div>
          <div style="background:#EDEEF0;padding:18px 36px;display:flex;justify-content:space-between;align-items:center">
            <div style="font-size:18px;font-weight:800;letter-spacing:-.04em;text-transform:uppercase;color:rgb(25,8,6)">bre<span style="color:#0021BC">.</span>vet</div>
            <div style="font-size:11px;color:#8A8DAA">© 2026 Prépa Brevet</div>
          </div>
        </div>
      `
    });

    return res.status(200).json({ ok: true, message: 'Email envoyé' });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Erreur envoi email', details: err.message });
  }
};
