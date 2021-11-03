import getDb from "../database";
import logout from "../logout";
import auth from "../utils/auth";

export default async function login(req, res) {
  const { sessions } = await getDb();

  try {
    const { uuid } = await auth(req, res);
    await logout(req, res);

    await sessions.updateOne({ uuid }, { $inc: { tokenVersion: 1 } });

    console.log(
      "sessions.findOne({uuid}) :>> ",
      await sessions.findOne({ uuid })
    );

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(401).json({ success: false, error: e });
  }
}
