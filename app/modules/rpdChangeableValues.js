const RpdChangeableValues = require('../models(mongo)/rpd-changeable-values-model');

async function getChangeableValue(title) {
    const value = await RpdChangeableValues.findOne({ title });    
    return value;
}

async function updateChangeableValue(_id, value) {
    const updatedValue = await RpdChangeableValues.findOneAndUpdate(
        { _id }, 
        { value }, 
        { new: true }
    );
    return updatedValue;
}

module.exports = {
    getChangeableValue,
    updateChangeableValue
};