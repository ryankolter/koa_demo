import {createHash, pbkdf2, randomBytes, createCipheriv, createDecipheriv, publicEncrypt, privateDecrypt, constants} from "crypto";
import config from "config";
import fs from "fs";

const AES_ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

// ===== 简单加密算法，包括MD5，SHA1, pbkdf2等 =====

export const string2md5 = (s) => {
    if (!s || s.length === 0) return null;
    let md5 = createHash('md5');
    return md5.update(s).digest('hex');
};

export const string2sha1 = (s) => {
    if (!s || s.length === 0) return null;
    let sha1 = createHash('sha1');
    return sha1.update(s).digest('hex');
};

//pbkdf2用于加密口令密码，被认为是过时的，不要用，2019年业界提出较安全的方案是argon2(最好是其中的Argon2id)
export const pbkdf2Encrypt = async (password) => {
    return new Promise((resolve)=>{
        pbkdf2(password, config.pbkdf2_salt, 4096, 512, 'sha256', (err, key) => {
            if (err) throw err;
            resolve(key.toString('hex'));
        });
    });
}

// ===== AES对称加密算法，默认为256位长度，GCM并行加密方式 =====

export const AESEncrypt = (text) => {
    if (!text || text.length === 0) return null;
    let iv = randomBytes(IV_LENGTH);
    let cipher = createCipheriv(AES_ALGORITHM, config.aes_key, iv); 
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ":" + encrypted.toString('hex');
};

export const AESDecrypt = (text) => {
    if (!text || text.length === 0) return null;
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = createDecipheriv(AES_ALGORITHM, config.aes_key, iv); 
    let decrypted = decipher.update(encryptedText);
    //TO_FIX: 下面这一行的 decipher.final() 会报错，注释掉就没事，但不知道不调用会有什么副作用...
    //decrypted = Buffer.concat([decrypted, decipher.final('utf8')]);
    return decrypted.toString();
};

// ===== RSA非对称加密算法，默认为公钥加密，私钥解密 =====

export const RSAEncrypt = (s, public_key_path) => {
    if (!s || s.length === 0) return null;
    let publicKey = fs.readFileSync(public_key_path, 'ascii').toString();
    let encryptResult = publicEncrypt({key: publicKey, padding: constants.RSA_PKCS1_PADDING}, Buffer.from(s,'utf8'))
    return encryptResult.toString('base64');
};

export const RSADecrypt = (s, private_key_path) => {
    if (!s || s.length === 0) return null;
    let privateKey = fs.readFileSync(private_key_path, 'ascii').toString();
    let decryptResult = privateDecrypt({key: privateKey, padding: constants.RSA_PKCS1_PADDING}, Buffer.from(s,'base64'))
    return decryptResult.toString('utf8');
};
