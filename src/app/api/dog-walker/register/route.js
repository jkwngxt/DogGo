import { DogWalkerController } from '@/controllers/DogWalkerController.js';

const dogWalkerController = new DogWalkerController();

export const dogWalkerHandler = {
    async register(req, res) {
        try {
            const result = await dogWalkerController.register(req.body);
            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
};