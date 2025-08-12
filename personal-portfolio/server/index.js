require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const nodemailer = require('nodemailer');
const validator = require('validator');

const app = express();

/* ------------------------ Segurança base ------------------------ */
app.disable('x-powered-by');

// Helmet (headers seguros)
app.use(helmet({
  crossOriginResourcePolicy: false, // API, sem servir arquivos
}));

// Body parser com limite
app.use(express.json({ limit: '32kb' }));

// HPP: evita poluição de parâmetros (?a=1&a=2)
app.use(hpp());

/* ----------------------------- CORS ----------------------------- */
// Suporte a múltiplas origens via .env: ORIGIN1,ORIGIN2
const ALLOWED = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean); // ex.: "https://lincolnsantiago07.github.io,http://localhost:3000"

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);                // curl/healthcheck etc.
    if (ALLOWED.includes(origin)) return cb(null, true);
    return cb(null, false);                            // nega CORS sem lançar erro (evita 500 no preflight)
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
// responde pré-flight (OPTIONS) para qualquer rota
app.options('*', cors(corsOptions));

/* --------------- Rate limit + Slow down na /contact -------------- */
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
});
const speedLimiter = slowDown({
  windowMs: 60 * 1000,
  delayAfter: 3,
  delayMs: () => 250,           // nova semântica da v2
  validate: { delayMs: false }  // silencia o warning
});

/* --------------------- Utilidades de sanitização --------------------- */
function escapeHtml(s = '') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
function sanitize(s = '', max = 2000) {
  // remove caracteres de controle e limita tamanho
  return escapeHtml(s).replace(/[\u0000-\u001F\u007F]/g, '').slice(0, max);
}

/* ------------------------ Nodemailer (Gmail) ------------------------ */
const transporter = nodemailer.createTransport({
  // pode usar service:'gmail' também, mas host/porta deixa explícito
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  pool: true,
  maxConnections: 1,
  maxMessages: 50,
  rateDelta: 60_000,
  rateLimit: 15,
  socketTimeout: 20_000,
  connectionTimeout: 10_000,
  greetingTimeout: 10_000
});

// Valida conexão SMTP na subida (log não fatal)
transporter.verify()
  .then(() => console.log('[SMTP] OK'))
  .catch((e) => console.error('[SMTP] Falha na verificação:', e.message));

/* -------------------------- Healthchecks -------------------------- */
app.get('/', (_req, res) => res.type('text').send('OK'));
app.get('/ping', (_req, res) => res.json({ ok: true }));

/* ---------------------------- Endpoint ---------------------------- */
app.post('/contact', speedLimiter, limiter, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message, subject, hp } = req.body || {};

    // Honeypot: se preenchido, finge sucesso e encerra
    if (hp) return res.json({ code: 200, message: 'OK' });

    // Validações mínimas
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ code: 400, message: 'Required fields missing.' });
    }
    if (!validator.isEmail(String(email))) {
      return res.status(400).json({ code: 400, message: 'Invalid e-mail.' });
    }

    const normalizedEmail = validator.normalizeEmail(String(email), { gmail_remove_dots: false });
    if (!normalizedEmail || !validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ code: 400, message: 'Invalid e-mail .' });
    }

    // Limites de tamanho para evitar abuso
    const safe = {
      firstName: sanitize(firstName, 60),
      lastName:  sanitize(lastName, 60),
      email:     String(email).trim(),
      phone:     sanitize(phone || '', 40),
      subject:   sanitize((subject && subject.trim()) || '', 140),
      message:   sanitize(message, 4000)
    };

    const subj = safe.subject || `Contato do Portfólio — ${safe.firstName} ${safe.lastName}`;

    const text =
`Nome: ${safe.firstName} ${safe.lastName}
E-mail: ${safe.email}
Telefone: ${safe.phone || '-'}
Assunto: ${subj}

${safe.message}`;

    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height:1.45">
        <h2 style="margin:0 0 12px">Nova mensagem do portfólio</h2>
        <p><strong>Nome:</strong> ${safe.firstName} ${safe.lastName}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(safe.email)}</p>
        <p><strong>Telefone:</strong> ${safe.phone || '-'}</p>
        <p><strong>Assunto:</strong> ${subj}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
        <div>${safe.message.replace(/\n/g, '<br/>')}</div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || `"${process.env.FROM_NAME || 'Portfolio – Lincoln'}" <${process.env.SMTP_USER}>`,
      to: process.env.TO_EMAIL || process.env.SMTP_USER,
      replyTo: safe.email,
      subject: subj,
      text,
      html
    });

    return res.json({ code: 200, message: 'Message sent successfully' });
  } catch (err) {
    console.error('[CONTACT] erro:', err);
    return res.status(500).json({ code: 500, message: 'Failed to send email' });
  }
});

/* --------------------------- Inicialização --------------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
