const settings = require("../model/Settings");


const SettingsController = {};

// Get all settings
SettingsController.getSettings = async (req, res) => {
  try {
    const search = req.query.key;
    if (search) {
      const filteredSettings = await settings.find({
        key: { $regex: search, $options: 'i' },
        deleted_at: null
      });
      return res.status(200).json(filteredSettings);
    }
    const allSettings = await settings.find({ deleted_at: null });
    res.status(200).json(allSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

// Create a new setting
SettingsController.createSettings = async (req, res) => {
  try {
    const { key, type, value } = req.body;
    const newSetting = new settings({
      key,
      type,
      value,
    });
    await newSetting.save();
    res.status(201).json({ message: "Setting created successfully", setting: newSetting });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit a setting by ID
SettingsController.editSettings = async (req, res) => {
  try {
    const setting = await settings.findById(req.params.id);
    if (!setting || setting.deleted_at) {
      return res.status(404).json({ message: "Setting not found" });
    }
    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a setting by ID
SettingsController.updateSettings = async (req, res) => {
  try {
    const { key, type, value } = req.body;
    const updatedSetting = await settings.findByIdAndUpdate(
      req.params.id,
      { key, type, value },
      { new: true }
    );
    if (!updatedSetting) {
      return res.status(404).json({ message: "Setting not found" });
    }
    res.status(200).json({ message: "Setting updated successfully", setting: updatedSetting });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Soft delete a setting by ID
SettingsController.deleteSettings = async (req, res) => {
  try {
    const deletedSetting = await settings.findByIdAndUpdate(
      req.params.id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!deletedSetting) {
      return res.status(404).json({ message: "Setting not found" });
    }
    res.status(200).json({ message: "Setting deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = SettingsController;