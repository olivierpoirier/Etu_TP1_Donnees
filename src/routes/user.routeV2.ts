import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import express from 'express';

const router = Router();
const userController = new UserController();



router.use(express.json()); //Important sinon les jsons post ne marchent pas avec postman

/**
 * @swagger
 * /v2/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Authentifier un utilisateur
 *     description: Authentifie un utilisateur à partir de son email et mot de passe et génère un token JWT si l'authentification est réussie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object

 *             properties:
 *               email:
 *                 type: string
 *                 description: Adresse email de l'utilisateur.
 *                 exemple: "chocococ@gmail.com"     
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur.
 *                 exemple: "gaytangDugrandPré"     
 *             required:
 *               - email
 *               - password
 *           example:
 *             email: "chocococ@gmail.com"
 *             password: "gaytangDugrandPré"
 *     responses:
 *       200:
 *         description: Authentification réussie, retourne un token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT.
 *       401:
 *         description: Mot de passe et/ou courriel incorrect ou utilisateur non trouvé.
 *       400:
 *         description: Erreur dans la syntaxe de la requête.
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique du user
 *           example: 1
 *         username:
 *           type: string
 *           description: Nom du user
 *           example: "paul"
 *         password:
 *           type: string
 *           description: Mot de passe du user
 *           example: "gaytangDugrandPré"
 *         email:
 *           type: string
 *           description: Email du user
 *           example: "chocococ@gmail.com"
 *         role:
 *           type: string
 *           description: Role du travailleur. Soit "Employé" ou "Gestionnaire"
 *           example: "Employé"
 */
router.post('/v2/users/login', userController.login);



/**
 * @swagger
 * /v2/users/signIn:
 *   post:
 *     tags:
 *       - Users
 *     summary: Créer un nouvel utilisateur
 *     description: Enregistre un nouvel utilisateur avec un rôle (Gestionnaire ou Employé) et un mot de passe hashé.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur.
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur.
 *               email:
 *                 type: string
 *                 description: Adresse email de l'utilisateur.
 *               role:
 *                 type: string
 *                 description: Rôle de l'utilisateur, doit être "Gestionnaire" ou "Employé".
 *                 enum: ["Gestionnaire", "Employé"]
 *             required:
 *               - username
 *               - password
 *               - email
 *               - role
 *           example:
 *             username: "paul"
 *             password: "gaytangDugrandPré"
 *             email: "chocococ@gmail.com"
 *             role: "Employé"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Requête incorrecte (paramètres manquants ou regex email invalide).
 */
router.post('/v2/users/signIn', userController.signIn);

export default router;