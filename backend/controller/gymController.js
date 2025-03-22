const Gym = require("../models/GymSchema");


exports.listGyms = async (req, res) => {
    try {
      const gyms = await Gym.find()
        .select('name address contact amenities operatingHours isActive');
  
      res.status(200).json({
        status: 'success',
        results: gyms.length,
        data: { gyms }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Could not retrieve gyms',
        error: error.message
      });
    }
  };


  exports.getGymDetails = async (req, res) => {
    try {
      const gym = await Gym.findById(req.params.id)
        .populate('owner', 'name');
  
      if (!gym) {
        return res.status(404).json({
          status: 'fail',
          message: 'Gym not found'
        });
      }
  
      res.status(200).json({
        status: 'success',
        data: { gym }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Could not retrieve gym details',
        error: error.message
      });
    }
  };

  exports.getGymsByOwner = async (req, res) => {
    try {
      const gyms = await Gym.find({ owner: req.params.userId })
        .select('name address contact amenities operatingHours isActive')
        .populate('owner', 'name');
  
      res.status(200).json({
        status: 'success',
        results: gyms.length,
        data: { gyms }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Could not retrieve owner gyms',
        error: error.message
      });
    }
  };