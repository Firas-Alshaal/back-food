export const GenerateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOTP = async (otp: Number, to: string) => {
  const accountSid = "AC30756450bc55f7593a9b9df57124bc13";
  const authToken = "cca27794442f417b0ad2c757999d2f25";
  const verifySid = "VAba96b3fc036f59ac02aaa3e1e0211d86";
  const client = require("twilio")(accountSid, authToken);

  return await client.messages
    .create({
      body: `${otp}`,
      from: "+19492844828",
      to: "+18777804236",
    })
    .catch((error: any) => console.error(error));
};
