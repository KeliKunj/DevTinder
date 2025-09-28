const authAdmin = (req, res, next) => {
     //logic of checking if request is authorizezed or not
  const token = "xyzas";
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {    
      console.log("If UnAuthorized");
      res.status(401).send("UnAuthorized Request");    
} else {
      next();
}
};
const authUser = (req, res, next) => {
     //logic of checking if request is authorizezed or not
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {    
      res.status(401).send("UnAuthorized Request");    
} else {
      next();
}
};

module.exports = {
    authAdmin,
    authUser
}