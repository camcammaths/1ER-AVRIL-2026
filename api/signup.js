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
  const nom = prenom || email.split('@')[0];

  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Bienvenue sur Prépa Brevet !',
      html: '<h1>Bienvenue ' + nom + ' !</h1><p>Ton compte est prêt. Bonne préparation !</p>'
    });

    console.log('Email envoyé:', result);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erreur:', err);
    return res.status(500).json({ error: err.message });
  }
};
