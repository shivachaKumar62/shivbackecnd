import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  
  // Check if the Authorization header is missing
  if (!token) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

  // Check if the Authorization header has the Bearer scheme
  if (!token.startsWith('Bearer ')) {
    return res.status(401).send({ error: 'Invalid token format. Format should be "Bearer <token>".' });
  }

  try {
    // Extract the token value without the 'Bearer ' prefix
    const tokenValue = token.split(' ')[1];
    
    const decoded = jwt.verify(tokenValue, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your actual secret
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send({ error: 'Invalid token.' });
  }
};

export default auth;
