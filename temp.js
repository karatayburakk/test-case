/**
 * @openapi
 * /articles:
 *   get:
 *     tags:
 *     - Articles
 *     description: Responds all the articles
 *     responses:
 *       200:
 *          description: All The Articles
 *
 */
/**
 * @openapi
 * /articles:
 *   post:
 *     tags:
 *     - Articles
 *     description: Create new article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateArticleDto'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateArticleResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad Request
 *
 */
/**
 * @openapi
 * components:
 *  schemas:
 *     CreateArticleDto:
 *       type: object
 *       required:
 *         - userId
 *         - title
 *         - text
 *       properties:
 *         userId:
 *           type: number
 *           default: 1
 *         title:
 *           type: string
 *           default: Title Example
 *         content:
 *           type: string
 *           default: Text Example
 *     CreateArticleResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         userId:
 *           type: number
 *         title:
 *           type: string
 *         content:
 *           type: string
 */
