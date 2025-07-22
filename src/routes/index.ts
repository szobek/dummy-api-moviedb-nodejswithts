import { Router, Request, Response } from 'express';
import db from '../config/knex'; // Importáljuk a Knex példányt

const router = Router();

// Tegyük fel, hogy van egy 'users' táblánk
interface User {
  id: number;
  name: string;
  email: string;
}

// GET /api/users - Összes felhasználó lekérdezése
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users: User[] = await db<User>('users').select('*');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hiba történt a felhasználók lekérdezése során.' });
  }
});

// POST /api/users - Új felhasználó létrehozása
router.post('/users', async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: 'A név és az email megadása kötelező.' });
        }
        
        const newUser = { name, email };

        const [userId] = await db<User>('users').insert(newUser);

        res.status(201).json({ id: userId, ...newUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hiba történt a felhasználó létrehozása során.' });
    }
});


export default router;