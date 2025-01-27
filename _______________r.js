/*

𝗮𝗯𝗮𝗻𝗴 𝗹𝗼𝗹𝗼𝗻𝗴 𝗹𝗮𝗴𝗶 𝗻𝗴𝗼𝗿𝗲𝗸, CAKEEEP!! 𝗻𝘆𝗼𝗹𝗼𝗻𝗴 𝗱𝗼𝗮𝗻𝗴 𝘁𝗮𝗽𝗶 𝗴𝗮𝗸 𝘀𝘂𝗯𝗿𝗲𝗸😭😭

https://youtube.com/@rendyx_solo-player?si=lCxluX-woYvaL2yp


𝗮𝗯𝗮𝗻𝗴 𝗹𝗼𝗹𝗼𝗻𝗴 𝗹𝗮𝗴𝗶 𝗻𝗴𝗼𝗿𝗲𝗸, CAKEEEP!! 𝗻𝘆𝗼𝗹𝗼𝗻𝗴 𝗱𝗼𝗮𝗻𝗴 𝘁𝗮𝗽𝗶 𝗴𝗮𝗸 𝘀𝘂𝗯𝗿𝗲𝗸😭😭

https://youtube.com/@rendyx_solo-player?si=lCxluX-woYvaL2yp


𝗮𝗯𝗮𝗻𝗴 𝗹𝗼𝗹𝗼𝗻𝗴 𝗹𝗮𝗴𝗶 𝗻𝗴𝗼𝗿𝗲𝗸, CAKEEEP!! 𝗻𝘆𝗼𝗹𝗼𝗻𝗴 𝗱𝗼𝗮𝗻𝗴 𝘁𝗮𝗽𝗶 𝗴𝗮𝗸 𝘀𝘂𝗯𝗿𝗲𝗸😭😭

https://youtube.com/@rendyx_solo-player?si=lCxluX-woYvaL2yp



𝗮𝗯𝗮𝗻𝗴 𝗹𝗼𝗹𝗼𝗻𝗴 𝗹𝗮𝗴𝗶 𝗻𝗴𝗼𝗿𝗲𝗸, CAKEEEP!! 𝗻𝘆𝗼𝗹𝗼𝗻𝗴 𝗱𝗼𝗮𝗻𝗴 𝘁𝗮𝗽𝗶 𝗴𝗮𝗸 𝘀𝘂𝗯𝗿𝗲𝗸😭😭

https://youtube.com/@rendyx_solo-player?si=lCxluX-woYvaL2yp



𝗮𝗯𝗮𝗻𝗴 𝗹𝗼𝗹𝗼𝗻𝗴 𝗹𝗮𝗴𝗶 𝗻𝗴𝗼𝗿𝗲𝗸, CAKEEEP!! 𝗻𝘆𝗼𝗹𝗼𝗻𝗴 𝗱𝗼𝗮𝗻𝗴 𝘁𝗮𝗽𝗶 𝗴𝗮𝗸 𝘀𝘂𝗯𝗿𝗲𝗸😭😭

https://youtube.com/@rendyx_solo-player?si=lCxluX-woYvaL2yp


𝗮𝗯𝗮𝗻𝗴 𝗹𝗼𝗹𝗼𝗻𝗴 𝗹𝗮𝗴𝗶 𝗻𝗴𝗼𝗿𝗲𝗸, CAKEEEP!! 𝗻𝘆𝗼𝗹𝗼𝗻𝗴 𝗱𝗼𝗮𝗻𝗴 𝘁𝗮𝗽𝗶 𝗴𝗮𝗸 𝘀𝘂𝗯𝗿𝗲𝗸😭😭

https://youtube.com/@rendyx_solo-player?si=lCxluX-woYvaL2yp



*/


const fs = require("fs");
const path = require("path");
const axios = require("axios");
const chalk = require("chalk");
const readline = require("readline");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, jidDecode, makeInMemoryStore } = require("@whiskeysockets/baileys");

// Konfigurasi dasar
const usePairingCode = true;
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });

// Fungsi untuk membaca input dari terminal
const question = (question) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
    }));
};

// Fungsi untuk membuat OTP
function generateOTP(length) {
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
}

// Fungsi utama untuk koneksi ke WhatsApp
async function ConnetToWhatsapp() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");
    const client = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: !usePairingCode,
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    if (usePairingCode && !client.authState.creds.registered) {
        const otpLength = 6;
        const verificationCode = generateOTP(otpLength);
        const phoneNumber = await question(chalk.cyan.bold("Enter Your Number\nNumber : "));
        const pairingCode = await client.requestPairingCode(phoneNumber);
        console.log(chalk.green.bold("Code : " + pairingCode));
    }

    store.bind(client.ev);

    client.ev.on("messages.upsert", async (update) => {
        try {
            const message = update.messages[0];
            if (!message.message) return;

            const sender = message.key.fromMe
                ? client.user.id.split(":")[0] || client.user.id
                : message.key.participant || message.key.remoteJid;

            message.message = Object.keys(message.message)[0] === "ephemeralMessage"
                ? message.message.ephemeralMessage.message
                : message.message;

            if (message.key.remoteJid === "status@broadcast") return;

            // Memproses pesan
            console.log(chalk.green("DONE ABANG KUUH🔥"));
        } catch (err) {
            console.error(chalk.red("Error processing message:", err));
        }
    });

    client.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decoded = jidDecode(jid) || {};
            return decoded.user && decoded.server ? decoded.user + "@" + decoded.server : jid;
        } else {
            return jid;
        }
    };

    client.ev.on("connection.update", async (connection) => {
        const { connection: connectionStatus, lastDisconnect } = connection;
        if (connectionStatus === "close") {
            const statusCode = new Boom(lastDisconnect?.error)?.output.statusCode;
            console.log(chalk.red("Connection error:", lastDisconnect.error));

            if (statusCode === DisconnectReason.badSession) {
                console.log(chalk.red("Bad Session File. Delete session and try again."));
                process.exit();
            } else if (statusCode === DisconnectReason.connectionClosed) {
                console.log(chalk.yellow("Connection closed. Reconnecting..."));
                process.exit();
            } else if (statusCode === DisconnectReason.connectionLost) {
                console.log(chalk.yellow("Connection lost. Reconnecting..."));
                await ConnetToWhatsapp();
            } else if (statusCode === DisconnectReason.loggedOut) {
                console.log(chalk.red("Logged out. Please scan again."));
                process.exit();
            } else if (statusCode === DisconnectReason.restartRequired) {
                console.log(chalk.yellow("Restarting..."));
                await ConnetToWhatsapp();
            } else if (statusCode === DisconnectReason.timedOut) {
                console.log(chalk.yellow("Connection timed out. Reconnecting..."));
                await ConnetToWhatsapp();
            }
        } else if (connectionStatus === "connecting") {
            console.log(chalk.cyan("Menghubungkan . . ."));
        } else if (connectionStatus === "open") {
            console.log(chalk.green("Bot berhasil tersambung!"));
        }
    });

    client.ev.on("creds.update", saveCreds);

    return client;
}

// Fungsi untuk mengirim pesan
async function sendMessages(client, targetNumber, messageCount) {
    const stickerPath = path.join(__dirname, "blackSticker_ByReyhan.webp");

    if (!fs.existsSync(stickerPath)) {
        console.error(chalk.red("File rey.webp tidak ditemukan."));
        return;
    }

    for (let i = 0; i < messageCount; i++) {
        try {
            const stickerBuffer = fs.readFileSync(stickerPath);
            await client.sendMessage(targetNumber + "@s.whatsapp.net", { sticker: stickerBuffer });
            await delay(49);
        } catch (error) {
            console.error(chalk.red("Error in sendMessages:", error));
        }
    }
}

// Fungsi delay
// Fungsi delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fungsi utama untuk menjalankan program
async function main() {
    const client = await ConnetToWhatsapp();

    console.log(chalk.cyan(""));
    await delay(4000); // Tambahkan delay 4 detik

    const nomorTujuan = await question(chalk.cyan("Masukkan nomor Target: "));
    const jumlahPesan = await question(chalk.cyan("Jumlah: "));

    // Validasi input
    if (!nomorTujuan || isNaN(jumlahPesan) || jumlahPesan <= 0) {
        console.log(chalk.red("Input tidak valid. Pastikan nomor dan jumlah pesan benar."));
        process.exit();
    }

    console.log(chalk.yellow("Mengirim pesan..."));

    // Kirim pesan
    await sendMessages(client, nomorTujuan, parseInt(jumlahPesan));

    console.log(chalk.green(`\nPESAN TELAH DI KIRIM SEBANYAK ${jumlahPesan}`));
}

main().catch((err) => console.error(chalk.red("Error in main:", err)));
