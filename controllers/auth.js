import { response } from "express";
import bcryptjs from "bcryptjs";
import { User } from "../models/user.js";
import { generateJWT } from "../helpers/generate-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";

const login = async (req, res = response) => {
  const { mail, password } = req.body;
  try {
    const user = await User.findOne({ mail });

    // Validate user exists
    if (!user)
      return res.status(400).json({ msg: "Mail / Password incorrect - mail" });

    // Validate state of user
    if (!user.state)
      return res
        .status(400)
        .json({ msg: "Mail / Password incorrect - state: false" });

    // Validate password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword)
      return res
        .status(400)
        .json({ msg: "Mail / Password incorrect - password" });

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Algo salio mal, hable con el administrador",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, img, mail } = await googleVerify(id_token);

    let user = await User.findOne({ mail });

    if (!user) {
      const data = {
        name,
        mail,
        password: ":D",
        img,
        google: true,
        role: "USER_ROLE",
      };

      user = new User(data);
      await user.save();
    }

    if (!user.state) {
      return res.status(401).json({
        msg: "Disabled user, talk to an administrator",
      });
    }

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "El token no se pudo verificar",
    });
  }
};

export { login, googleSignIn };
