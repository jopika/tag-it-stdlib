const lib = require("lib");

/**
 * Get info about exhibits
 * @param {string} id name of the exhibit, ie "mummy"
 * @returns {object} exhibit details object
 */
module.exports = async function get_info(id, context) {
	const { [id]: exhibit } = await lib[
		`${context.service.identifier}.get_bulk_info`
	]([id]);
	return exhibit;
};
