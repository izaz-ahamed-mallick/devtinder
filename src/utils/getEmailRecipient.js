const getEmailRecipient = (actualEmail) => {
  return process.env.NODE_ENV === "production"
    ? actualEmail
    : process.env.TEST_EMAIL;
};

module.exports=getEmailRecipient
