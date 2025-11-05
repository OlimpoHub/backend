const User = require("../models/user.model");
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");

dotenv.config({ path: '../.env'});

exports.recoverPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const exists = await User.existsByEmail(email);
    if (!exists) {
        return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const transporter = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 587,
        auth: {
            user: process.env.MAILGUN_USER,
            pass: process.env.MAILGUN_PASSWORD
        }
    });

    const link = `${process.env.BASE_URL}/user/verify-token?token=${token}`

    await transporter.sendMail({
        from: `"El arca" <${process.env.MAILGUN_USER}>`,
        to: `${email}`,
        subject: 'Recuperar Contraseña',
        text: 'Dale click al siguiente link para recuperar contraseña',
        html: `
        <!DOCTYPE html>
        <html lang="es" style="margin:0; padding:0;">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Recuperación de Contraseña</title>
        <style>
            body {
            margin: 0;
            padding: 0;
            background-color: #e8ecf3;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            }
            .container {
            max-width: 480px;
            margin: 40px auto;
            background-color: #fdfdfd;
            border-radius: 12px;
            border: 1px solid #acacacff;
            box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
            overflow: hidden;
            }
            .header {
            background-color: #4f46e5;
            color: white;
            text-align: center;
            padding: 24px 16px;
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 0.5px;
            }
            .content {
            padding: 24px 32px;
            text-align: left;
            }
            .content p {
            line-height: 1.6;
            font-size: 15px;
            color: #444;
            }
            .button {
            display: inline-block;
            background-color: #4f46e5;
            color: white !important;
            text-decoration: none;
            padding: 14px 24px;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 600;
            font-size: 16px;
            }
            .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            padding: 16px;
            }

            /* Responsive styling */
            @media only screen and (max-width: 600px) {
            .container {
                width: 92%;
                margin: 20px auto;
            }
            .content {
                padding: 20px;
            }
            }
        </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
            Recuperación de Contraseña
            </div>
            <div class="content">
            <p>Hola,</p>
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Da clic en el botón de abajo para crear una nueva.</p>
            <center>
                <a href="${link}" class="button">Restablecer Contraseña</a>
            </center>
            <p>Si tú no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
            <p>Gracias,<br><strong>El Arca de México I.A.P.</strong></p>
            </div>
            <div class="footer">
            &copy; ${new Date().getFullYear()} El Arca de México I.A.P. Todos los derechos reservados.
            </div>
        </div>
        </body>
        </html>
        `

    });

    res.status(200).json({ message: 'Recovery email sent' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.verifyToken = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ valid: false, message: 'Token is required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.status(200).json({
            valid: true,
            email: decoded.email,
            message: 'Email verified with an valid token',
        });
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(400).json({
            valid: false,
            message: 'Invalid or expired token',
        })
    }
}

exports.registerPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const success = await User.registerPassword(email, password);
        if (!success) {
            return res.status(400).json({
                status: false,
                message: 'Password registration failed'
            });
        }
    } catch (error) {
        console.error('Password registeration failed:', error.message);
    }
}