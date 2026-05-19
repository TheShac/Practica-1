import { loginService } from './auth.service.js';

export async function login(req, res) {
  try {
    const result = await loginService(req.body);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(err.status ?? 500).json({ message: err.message });
  }
}