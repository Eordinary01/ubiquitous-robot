const DEMO_EMAILS = [
  'demo@gym.com',
  'rahul@demo.com',
  'dummy1@demo.com',
  'dummy2@demo.com',
  'dummy3@demo.com',
];

const isDemoUser = (email) => {
  if (!email) return false;
  return DEMO_EMAILS.includes(email.toLowerCase()) || email.toLowerCase().endsWith('@demo.com');
};

const blockDemoAccountChanges = (req, res, next) => {
  const userEmail = req.user?.email || req.body?.email;
  if (isDemoUser(userEmail)) {
    if (
      req.body?.password ||
      (req.body?.email && req.user && req.body.email.toLowerCase() !== req.user.email.toLowerCase())
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Demo accounts cannot modify credentials (email or password)",
      });
    }
  }
  next();
};

module.exports = {
  DEMO_EMAILS,
  isDemoUser,
  blockDemoAccountChanges,
};
