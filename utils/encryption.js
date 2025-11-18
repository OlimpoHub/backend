const crypto = require("crypto");
const ALGORITHM = "aes-256-cbc";
const SECRET_KEY = crypto.createHash("sha256").update(process.env.QR_SECRET_KEY).digest();
const IV_LENGTH = 16;

// Encrypts a text based on a key
exports.encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return iv.toString("base64") + ":" + encrypted;
};

// Decrypts a text based on a key
exports.decrypt = (encryptedText) => {
    const [ivBase64, encryptedData] = encryptedText.split(":");
    const iv = Buffer.from(ivBase64, "base64");
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    let decrypted = decipher.update(encryptedData, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};