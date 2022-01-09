import getUser from "../../utils/getUser";

/**
 * @param {{ cookies: { accessToken: any; refreshToken: any; }; }} req
 * @param {import("next").NextApiResponse<any>} res
 *
 * @returns {Promise<void>} resolves a user, if no user is resolved, resolves null
 */
export default async function authGetUser(req, res) {
  try {
    const user = await getUser({ req, res });

    res.status(200).json({ user: user.props.user });
  } catch (e) {
    res.status(200).json({ user: null });
  }
}
