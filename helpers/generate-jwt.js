import jwt from "jsonwebtoken";

const generateJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("Can not generate token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

export { generateJWT };
