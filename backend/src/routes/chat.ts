import { Router } from 'express';
const router = Router();

// 将来のHTTPエンドポイント用ダミー
router.get('/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

export default router;

