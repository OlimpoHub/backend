const User = require("../models/user.model");
const tokenUtils = require("../utils/token.utils");
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const argon2 = require('argon2');

dotenv.config({ path: '../.env'});

// Login user: validate credentials and return access + refresh tokens
exports.post_login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const user = await User.findByEmail(username); 
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isValidPassword = await argon2.verify(user.contrasena, password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const safeUser = {
            id: user.idUsuario,
            username: `${user.nombre} ${user.apellidoPaterno} ${user.apellidoMaterno ?? ''}`,
            role: user.roleName
        };

        const accessToken = tokenUtils.generateAccessToken({
            id: user.idUsuario,
            role: user.idRol,
        });

        const refreshToken = tokenUtils.generateRefreshToken({
            id: user.idUsuario,
        });

        return res.json({
            user: safeUser,
            accessToken,
            refreshToken,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Generate a new access token using a valid refresh token
exports.post_refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        console.log(refreshToken);
        if (!refreshToken) {
            console.log("xd Fui yo");
            return res.status(401).json({ message: 'Refresh token required' });
        }

        jwt.verify(refreshToken, tokenUtils.REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid refresh token' });
            }
            
            const user = await User.findById(decoded.id);
            console.log(decoded.id);
            console.log(user);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const newAccessToken = tokenUtils.generateAccessToken({ 
                id: user.idUsuario, 
                role: user.idRol,
            });

            return res.json({ accessToken: newAccessToken });
        });
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * recoverPassword
 * --------------------------------------------------------
 * Sends a password recovery email containing a JWT link
 * valid for 15 minutes.
 * 
 * @param {Object} req - Express request object
 * @param {string} req.body.email - User email
 * @param {Object} res - Express response object
 * 
 * @returns {JSON} { message: 'Recovery email sent' }
 */
exports.recoverPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const exists = await User.existsByEmail(email);
    if (!exists) {
        return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const transporter = nodemailer.createTransport({
        host: 'smtp.mailersend.net',
        port: 587,
        auth: {
            user: process.env.MAILSENDER_USER,
            pass: process.env.MAILSENDER_PASSWORD
        }
    });

    const link = `${process.env.APP_URL_SCHEME}/user/update-password?token=${token}`

    await transporter.sendMail({
        from: `"El arca" <${process.env.MAILSENDER_USER}>`,
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

/**
 * verifyToken
 * --------------------------------------------------------
 * Validates a password recovery token. If valid, returns
 * the associated email address.
 * 
 * @param {Object} req - Express request object
 * @param {string} req.query.token - Token to validate
 * @param {Object} res - Express response object
 * 
 * @returns {JSON} { valid: boolean, email?: string, message: string }
 */
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

/**
 * updatePassword
 * --------------------------------------------------------
 * Updates a user's password using their email.
 * 
 * @param {Object} req - Express request object
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - New password
 * @param {Object} res - Express response object
 * 
 * @returns {JSON} { status: boolean, message: string }
 */
exports.updatePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const encryptedPassword = await argon2.hash(password);
        const success = await User.updatePassword(email, encryptedPassword);
        if (!success) {
            return res.status(400).json({
                status: false,
                message: 'Password registration failed'
            });
        }
        return res.status(200).json({
            status: true,
            message: 'Password registered successfully'
        });
    } catch (error) {
        console.error('Password registeration failed:', error.message);
        return res.status(400).json({
            status: false,
            message: 'Password registration failed - error'
        });
    }
}

/**
 * getAllUsers
 * --------------------------------------------------------
 * Retrieves all registered users in the system.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * 
 * @returns {JSON} Array of user objects
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.fetchAllUser();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
            
    }
}