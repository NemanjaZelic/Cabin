const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const { protect, authorize } = require('../middleware/auth');
router.post('/', protect, authorize('turista'), reservationController.createReservation);
router.get('/user/:userId/current', protect, reservationController.getCurrentReservations);
router.get('/user/:userId/archive', protect, reservationController.getArchivedReservations);
router.put('/:id/cancel', protect, authorize('turista'), reservationController.cancelReservation);

router.get('/my-reservations', protect, authorize('vlasnik'), reservationController.getMyReservations);
router.get('/owner/:ownerId', protect, authorize('vlasnik'), reservationController.getOwnerReservations);
router.put('/:id/status', protect, authorize('vlasnik'), reservationController.updateReservationStatus);
module.exports = router;
