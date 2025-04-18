"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WardController = exports.validateWard = void 0;
const express_validator_1 = require("express-validator");
const ward_service_1 = require("../services/ward.service");
const wardService = new ward_service_1.WardService();
exports.validateWard = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Ward name is required'),
];
class WardController {
    /**
     * Create a new ward
     */
    async createWard(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { name } = req.body;
            const newWard = await wardService.createWard({ name });
            return res.status(201).json(newWard);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    /**
     * Get all wards
     */
    async getAllWards(_req, res) {
        try {
            const wards = await wardService.getAllWards();
            return res.status(200).json(wards);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    /**
     * Get ward by ID with projects
     */
    async getWardById(req, res) {
        try {
            const wardId = parseInt(req.params.id);
            if (isNaN(wardId)) {
                return res.status(400).json({ message: 'Invalid ward ID' });
            }
            const ward = await wardService.getWardById(wardId);
            return res.status(200).json(ward);
        }
        catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
}
exports.WardController = WardController;
