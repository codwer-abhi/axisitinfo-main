const adminMiddleware = (req, res, next) => {
 try{
    // Check if the user is authenticated and has admin privileges
    if (req.user && req.user.isAdmin) {
        next(); // User is an admin, proceed to the next middleware or route handler
    } else {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
 }catch(error){
    res.status(500).json({ message: 'Internal Server Error' });
 }

}

module.exports = adminMiddleware;