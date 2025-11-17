const crypto = require("crypto");
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

// Helper function to get the secret key with validation
function getSecretKey() {
    const secretKey = process.env.QR_SECRET_KEY;
    if (!secretKey) {
        throw new Error("QR_SECRET_KEY environment variable is not set");
    }
    return crypto.createHash("sha256").update(secretKey).digest();
}

// Encrypts a text based on a key
exports.encrypt = (text) => {
    const secretKey = getSecretKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, secretKey, iv);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return iv.toString("base64") + ":" + encrypted;
};

// Decrypts a text based on a key
exports.decrypt = (encryptedText) => {
    const secretKey = getSecretKey();
    const [ivBase64, encryptedData] = encryptedText.split(":");
    const iv = Buffer.from(ivBase64, "base64");
    const decipher = crypto.createDecipheriv(ALGORITHM, secretKey, iv);
    let decrypted = decipher.update(encryptedData, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};