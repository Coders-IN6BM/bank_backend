import Movement from './movement.model.js';

export const makeMoVEMENT = async (req, res) => {
    try {
        const movement = new Movement(req.body);
        await movement.save();
        res.status(201).json(movement);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};