import GoogleChat from "../services/googleChat.js";

export const chatWithGoogle = async (req, res) => {
  console.log(req.body.message);
  const prompt = req.body.message;
  const googleChat = new GoogleChat();
  const result = await googleChat.generateContent(prompt);
  console.log(result);
  res.json({
    receivedMessage: req.body.message,
    status: "success",
    result,
  });
};
