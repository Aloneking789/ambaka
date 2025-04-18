"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadController = exports.validateRoad = void 0;
const express_validator_1 = require("express-validator");
const road_service_1 = require("../services/road.service");
const roadService = new road_service_1.RoadService();
exports.validateRoad = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Road name is required'),
    (0, express_validator_1.body)('lengthKm').isFloat({ gt: 0 }).withMessage('Length must be a positive number'),
    (0, express_validator_1.body)('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    (0, express_validator_1.body)('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
    (0, express_validator_1.body)('projectId').isInt().withMessage('Valid project ID is required'),
];
class RoadController {
    /**
     * Create a new road entry
     */
    async createRoad(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { name, lengthKm, latitude, longitude, projectId } = req.body;
            const newRoad = await roadService.createRoad({
                name,
                lengthKm: parseFloat(lengthKm),
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                projectId: parseInt(projectId)
            });
            return res.status(201).json(newRoad);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    /**
     * Get roads by project
     */
    async getRoadsByProject(req, res) {
        try {
            const projectId = parseInt(req.params.projectId);
            if (isNaN(projectId)) {
                return res.status(400).json({ message: 'Invalid project ID' });
            }
            const roads = await roadService.getRoadsByProject(projectId);
            return res.status(200).json(roads);
        }
        catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
    /**
     * Get road by ID with geo-location
     */
    async getRoadById(req, res) {
        try {
            const roadId = parseInt(req.params.id);
            if (isNaN(roadId)) {
                return res.status(400).json({ message: 'Invalid road ID' });
            }
            const road = await roadService.getRoadById(roadId);
            return res.status(200).json(road);
        }
        catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
}
exports.RoadController = RoadController;
