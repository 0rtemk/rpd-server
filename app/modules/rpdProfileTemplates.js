const RpdProfileTemplates = require('../models(mongo)/rpd-profile-templates-model');

async function getJsonProfile(profile_server_key) {
    const value = await RpdProfileTemplates.findOne({ profile_server_key });    
    return value;
}

async function updateById(profile_server_key, fieldToUpdate, value) {
    const updatedItem = await RpdProfileTemplates.findOneAndUpdate(
        { profile_server_key },
        { $set: { [fieldToUpdate]: value }},
        { new: true }
    );

    return updatedItem;
}

module.exports = {
    getJsonProfile,
    updateById
};