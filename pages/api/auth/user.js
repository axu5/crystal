import authGetUser from "../user";

/**
 * @param {{ cookies: { accessToken: any; refreshToken: any; }; }} req
 * @param {import("next").NextApiResponse<any>} res
 *
 * @returns {Promise<void>} resolves a user, if no user is resolved, resolves null
 */
export default async function h(req, res) {
  await authGetUser(req, res);
}
