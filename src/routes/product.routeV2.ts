import express from 'express';
import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middlewares';
import { MongoProductController } from '../controllers/product.controllerV2';

const router = Router();
const mongoProductController = new MongoProductController();

router.use(express.json()); //Important sinon les jsons post ne marchent pas avec postman


/**
 * @swagger
 * /v2/products/{minPrice}/{maxPrice}/{minStock}/{maxStock}:
 *   get:
 *     summary: Récupérer tous les produits avec filtres optionnels
 *     description: Récupère une liste de produits filtrés par prix et stock.
 *     tags: [Products]
 *     parameters:
 *       - name: minPrice
 *         in: path
 *         required: false
 *         schema:
 *           type: integer
 *         description: Prix minimum
 *         example: "100"
 *       - name: maxPrice
 *         in: path
 *         required: false
 *         schema:
 *           type: integer
 *         description: Prix maximum
 *         example: "10000"
 *       - name: minStock
 *         in: path
 *         required: false
 *         schema:
 *           type: integer
 *         description: Stock minimum
 *         example: "10"
 *       - name: maxStock
 *         in: path
 *         required: false
 *         schema:
 *           type: integer
 *         description: Stock maximum
 *         example: "1000"
*     responses:
*       200:
*         description: Produit récupéré avec succès
*         content:
*           application/json:
*             schema:
*               $ref: 'Product'
*             examples:
*               example1:
*                 summary: Exemple d'un produit récupéré
*                 value:
*                   id: 1
*                   title: "Hamburger"
*                   description: "Un hamburger du McDonald"
*                   price: 139.99
*                   category: "Bouffe"
*                   stock: 42069
*       404:
*         description: Produit non trouvé
*/



/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique du produit
 *           example: 1
 *         title:
 *           type: string
 *           description: Nom du produit
 *           example: "Hamburger"
 *         description:
 *           type: string
 *           description: Description du produit
 *           example: "Un hamburger du McDonald"
 *         price:
 *           type: number
 *           description: Prix du produit
 *           example: 139.99
 *         category:
 *           type: string
 *           description: Catégorie du produit
 *           example: "Bouffe"
 *         stock:
 *           type: integer
 *           description: Quantité en stock
 *           example: 42069
 */
router.get('/products/:minPrice?/:maxPrice?/:minStock?/:maxStock?', mongoProductController.getAllProducts);


/**
 * @swagger
 * /v2/products:
 *   post:
 *     summary: Créer un nouveau produit
 *     description: Crée un nouveau produit.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Produit créé
 *       400:
 *         description: Requête incorrecte
 */
router.post('/products', authenticateToken, authorizeRole('Gestionnaire'), mongoProductController.createProduct);


/**
 * @swagger
 * /v2/products/{id}:
 *   put:
 *     summary: Modifier un produit existant
 *     description: Modifie un produit existant basé sur son ID.
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         example: 1
 *         schema:
 *           type: integer
 *         description: ID du produit à modifier.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produit modifié avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Requête incorrecte (regex non respectée ou erreur dans la demande).
 *       404:
 *         description: Produit non trouvé.
 */
router.put('/products/:id', authenticateToken, authorizeRole('Gestionnaire'), mongoProductController.modifyProduct);

/**
 * @swagger
 * /v2/products/{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     description: Supprime un produit existant basé sur son ID.
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         example: 1
 *         schema:
 *           type: integer
 *         description: ID du produit à supprimer.
 *     responses:
 *       204:
 *         description: Produit supprimé avec succès.
 *       404:
 *         description: Produit non trouvé.
 *       400:
 *         description: Erreur dans la requête (ID manquant ou invalide).
 */
router.delete('/products/:id', authenticateToken, authorizeRole('Gestionnaire'), mongoProductController.deleteProduct);
export default router;