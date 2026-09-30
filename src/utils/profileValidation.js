const validationProfileEdit = (req) => {
  const ALLOWED_EDIT_FIELD = ["firstName", "lastName", "age", "gender", "about", "skills"]
  const isNotAllowed = Object.keys(req.body).filter(key => !ALLOWED_EDIT_FIELD.includes(key))
  if (isNotAllowed.length > 0) {
    throw new Error(
      `${isNotAllowed.join(", ")} field(s) cannot be updated`
    );
  }
  return true
}

const updatePasswordValidation = (req, res, next) => {

  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      message: "Old password and new password are required"
    });
  }
  if (oldPassword === newPassword) {
    return res.status(400).json({
      message: "New password must be different from old password"
    });
  }
  next()
}

module.exports = { validationProfileEdit, updatePasswordValidation }
