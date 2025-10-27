const Cabin = require('../models/Cabin');
exports.getAllCabins = async (req, res) => {
  try {
    const { name, place, sortBy, sortOrder } = req.query;
    let query = {};
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (place) {
      query.place = { $regex: place, $options: 'i' };
    }
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }
    const cabins = await Cabin.find(query)
      .populate('owner', 'firstName lastName')
      .sort(sort);
    res.json({
      success: true,
      count: cabins.length,
      data: cabins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri učitavanju vikendica',
      error: error.message
    });
  }
};
exports.getCabinById = async (req, res) => {
  try {
    const cabin = await Cabin.findById(req.params.id)
      .populate('owner', 'firstName lastName phone email');
    if (!cabin) {
      return res.status(404).json({
        success: false,
        message: 'Vikendica nije pronađena'
      });
    }
    const Comment = require('../models/Comment');
    const comments = await Comment.find({ cabin: cabin._id })
      .populate('tourist', 'firstName lastName profileImage')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: {
        cabin,
        comments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri učitavanju vikendice',
      error: error.message
    });
  }
};
exports.createCabin = async (req, res) => {
  try {
    const {
      name,
      place,
      services,
      pricingSummer,
      pricingWinter,
      phone,
      latitude,
      longitude
    } = req.body;
    let images = [];
    let mainImage = null;
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`);
      mainImage = images[0];
    }
    const cabin = await Cabin.create({
      name,
      place,
      owner: req.user.id,
      services,
      pricing: {
        summer: pricingSummer,
        winter: pricingWinter
      },
      phone,
      coordinates: {
        latitude,
        longitude
      },
      mainImage,
      images
    });
    res.status(201).json({
      success: true,
      data: cabin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri kreiranju vikendice',
      error: error.message
    });
  }
};
exports.updateCabin = async (req, res) => {
  try {
    let cabin = await Cabin.findById(req.params.id);
    if (!cabin) {
      return res.status(404).json({
        success: false,
        message: 'Vikendica nije pronađena'
      });
    }
    if (cabin.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nemate ovlašćenje da ažurirate ovu vikendicu'
      });
    }
    
    const updateData = {
      name: req.body.name,
      place: req.body.place,
      services: req.body.services,
      phone: req.body.phone
    };
    
    if (req.body.pricingSummer || req.body.pricingWinter) {
      updateData.pricing = {
        summer: req.body.pricingSummer || cabin.pricing.summer,
        winter: req.body.pricingWinter || cabin.pricing.winter
      };
    }
    
    if (req.body.latitude || req.body.longitude) {
      updateData.coordinates = {
        latitude: req.body.latitude || cabin.coordinates.latitude,
        longitude: req.body.longitude || cabin.coordinates.longitude
      };
    }
    
    let finalImages = [];
    
    if (req.body['existingImages[]']) {
      const existingImages = Array.isArray(req.body['existingImages[]']) 
        ? req.body['existingImages[]'] 
        : [req.body['existingImages[]']];
      finalImages = [...existingImages];
    }
    
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => 
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      );
      finalImages = [...finalImages, ...newImages];
    }
    
    if (finalImages.length > 0) {
      updateData.images = finalImages;
      updateData.mainImage = finalImages[0];
    }
    
    cabin = await Cabin.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: cabin
    });
  } catch (error) {
    console.error('❌ Greška pri ažuriranju vikendice:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri ažuriranju vikendice',
      error: error.message
    });
  }
};
exports.deleteCabin = async (req, res) => {
  try {
    const cabin = await Cabin.findById(req.params.id);
    if (!cabin) {
      return res.status(404).json({
        success: false,
        message: 'Vikendica nije pronađena'
      });
    }
    if (cabin.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nemate ovlašćenje da obrišete ovu vikendicu'
      });
    }
    await cabin.deleteOne();
    res.json({
      success: true,
      message: 'Vikendica je obrisana'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri brisanju vikendice',
      error: error.message
    });
  }
};
exports.getCabinsByOwner = async (req, res) => {
  try {
    const cabins = await Cabin.find({ owner: req.params.ownerId });
    res.json({
      success: true,
      count: cabins.length,
      data: cabins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri učitavanju vikendica',
      error: error.message
    });
  }
};

exports.getMyCabins = async (req, res) => {
  try {
    const cabins = await Cabin.find({ owner: req.user.id });
    res.json({
      success: true,
      count: cabins.length,
      data: cabins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri učitavanju vikendica',
      error: error.message
    });
  }
};
