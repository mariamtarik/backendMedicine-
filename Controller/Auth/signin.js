const userModel = require("../../DB/Model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const signIn = async (req, res) => {
    const { email, password } = req.body;
    console.log(password);
    try {

        let user = await userModel.findOne({ email });
        console.log(user)
        if (!user) {
            res.json({ message: "Invalid Email" })
        }
        else {
            const match = await bcrypt.compare(password, user.password);
            console.log(password, user.password, match)

            if (match) {
                const token = jwt.sign({ id: user._id, name: user.name }, process.env.TOKENSIGNATURE)
                res.json({ message: "signin success", token })
            } else {
                res.json({ message: "invalid email or password" })

            }
        }

    } catch (err) {
        console.log(err);
        res.json({ message: "failed registerd", ...err })
    }


}
module.exports = signIn