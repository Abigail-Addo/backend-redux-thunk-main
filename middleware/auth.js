import jwt from 'jsonwebtoken';

export const authUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error('wrong token')
            } else {
                next();
            }
        })
    } else {
        res.status(401);
        throw new Error('no token');
    }

}