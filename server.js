// server.js
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config(); // подхватывает .env рядом с server.js

// 1) Проверим, что SECRET есть — иначе сразу понятная ошибка
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is missing in .env');
  process.exit(1);
}

// 2) Инициализируем Stripe (apiVersion указывать полезно)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20', // актуальная на сегодня, можно обновить при необходимости
});

const app = express();

// Разрешаем запросы с любого origin — для разработки это нормально
app.use(cors({
  origin: true,              // или можно написать '*' — эффект тот же
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 4) JSON body
app.use(express.json({ limit: '1mb' }));

// 5) Простейший health-check (полезно для проверки)
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// 6) Создание PaymentIntent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    console.log('🧾 Received payment request:', req.body);
    // Валидация суммы (amount должен быть числом > 0)
    if (typeof amount !== 'number' || !isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number (in euros).' });
    }

    // Создаём платеж (сумма в центах)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'eur',
      // Stripe сам подберёт доступные методы оплаты
      automatic_payment_methods: { enabled: true },
      // Можно добавить метаданные (необязательно, но удобно)
      // metadata: { source: 'toptransfer34', kind: 'booking' },
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    // Дадим аккуратный ответ клиенту
    return res.status(500).json({
      error: typeof error?.message === 'string' ? error.message : 'Internal server error',
    });
  }
});

// 7) Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});