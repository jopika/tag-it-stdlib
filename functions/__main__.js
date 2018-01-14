const lib = require("lib");

/**
 * Transfers an item from target (exhibit) to user
 * @param {string} userTag - user ID that recieves item
 * @param {string} targetTag - target ID to recieve item from
 * @returns {object} success validation
 */
module.exports = async function main(userTag, targetTag, context) {
	return await lib[`${context.service.identifier}.tagged`](userTag, targetTag);
};
