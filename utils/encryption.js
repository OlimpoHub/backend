const crypto = require("crypto");
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

function getSecretKey() {
    const raw = process.env.QR_SECRET_KEY;
    if (!raw) return null;
    return crypto.createHash("sha256").update(raw).digest();
}

exports.encrypt = (text) => {
    const SECRET_KEY = getSecretKey();
    if (!SECRET_KEY) {
        throw new Error(
            'QR_SECRET_KEY is not defined in the environment. Set QR_SECRET_KEY in .env to use encryption.'
        );
    }
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return iv.toString("base64") + ":" + encrypted;
};

// Decrypts a text based on a key
exports.decrypt = (encryptedText) => {
    const SECRET_KEY = getSecretKey();
    if (!SECRET_KEY) {
        throw new Error(
            'QR_SECRET_KEY is not defined in the environment. Set QR_SECRET_KEY in .env to use decryption.'
        );
    }
    const [ivBase64, encryptedData] = encryptedText.split(":");
    const iv = Buffer.from(ivBase64, "base64");
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    let decrypted = decipher.update(encryptedData, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};