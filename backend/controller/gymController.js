const Gym = require("../models/GymSchema");


exports.listGyms = async (req, res) => {
    try {
      const gyms = await Gym.find()
        .select('name address contact amenities operatingHours isActive gymLogo themeColor');
  
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
      const ownerId = (req.user && req.user.role === 'admin' && req.params.userId)
        ? req.params.userId
        : req.user.userId;

      const gyms = await Gym.find({ owner: ownerId })
        .select('name address contact amenities operatingHours isActive gymLogo themeColor')
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

  exports.updateGymBranding = async (req, res) => {
    try {
      const { id } = req.params;
      const { gymLogo, themeColor } = req.body;
      const userId = req.user.userId;

      const gym = await Gym.findById(id);
      if (!gym) {
        return res.status(404).json({
          status: 'fail',
          message: 'Gym not found'
        });
      }

      if (gym.owner.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          status: 'fail',
          message: 'Unauthorized: caller is not the gym owner'
        });
      }

      // Validate gymLogo if provided and not null
      if (gymLogo !== undefined && gymLogo !== null) {
        if (typeof gymLogo !== 'string') {
          return res.status(400).json({
            status: 'fail',
            message: 'gymLogo must be a string or null'
          });
        }
        if (gymLogo.length > 500) {
          return res.status(400).json({
            status: 'fail',
            message: 'gymLogo must not exceed 500 characters'
          });
        }
        if (!/^https:\/\/[^\s]+$/i.test(gymLogo)) {
          return res.status(400).json({
            status: 'fail',
            message: 'gymLogo must be a valid https URL'
          });
        }
        gym.gymLogo = gymLogo;
      } else if (gymLogo === null) {
        gym.gymLogo = null;
      }

      // Validate themeColor if provided and not null
      if (themeColor !== undefined && themeColor !== null) {
        if (typeof themeColor !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(themeColor)) {
          return res.status(400).json({
            status: 'fail',
            message: 'themeColor must match ^#[0-9a-fA-F]{6}$ (e.g., #1A2B3C)'
          });
        }
        gym.themeColor = themeColor;
      } else if (themeColor === null) {
        gym.themeColor = null;
      }

      await gym.save();

      res.status(200).json({
        status: 'success',
        data: {
          gym: {
            id: gym._id,
            name: gym.name,
            gymLogo: gym.gymLogo,
            themeColor: gym.themeColor
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Could not update gym branding',
        error: error.message
      });
    }
  };