import request from 'supertest';
import app from '../../src/index'; 
import jwt from 'jsonwebtoken';
import { config } from '../../src/config/config';
import { MongoProduct } from '../../src/data/databaseMongo';
import mongoose from 'mongoose';

describe("SQL INJECTIONS", () => {

    describe('Get All Product SQL Security', () => {

        it('should protect against SQL injections on minPrice', async () => {
            const response = await request(app)
              .get("/v2/products/' OR 1=1 --")

            expect(response.status).toBe(400); 
        });
    
        it('should protect against SQL injections on maxPrice', async () => {
            const response = await request(app)
              .get("/v2/products/200/' OR 1=1 --")
        
            expect(response.status).toBe(400); 
        });
    
        it('should protect against SQL injections on minStock', async () => {
            const response = await request(app)
              .get("/v2/products/0/200/' OR 1=1 --")

            expect(response.status).toBe(400); 
        });
    
        it('should protect against SQL injections on maxStock', async () => {
          const response = await request(app)
            .get("/v2/products/0/200/0/' OR 1=1 --")
      
          expect(response.status).toBe(400); 
        });
    });
    
    
    describe('Create Product SQL Security', () => {
    
        it('should protect against SQL injections on title', async () => {
            const response = await request(app)
              .post('/v2/products/')
              .send({
                  title: "' OR '1'='1",
                  price: 109.95,
                  description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                  category: "women's clothing",
                  stock:200
              }); 
        
            expect(response.status).toBe(401); 
        });
    
    
        it('should protect against SQL injections on price', async () => {
            const response = await request(app)
              .post('/v2/products/')
              .send({
                    title: "Fjallraven  Foldsack No  Backpk ",
                    price: "' OR '1'='1",
                    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                    category: "women's clothing",
                    stock:200
              }); 
        
            expect(response.status).toBe(401); 
        });
    
        it('should protect against SQL injections on description', async () => {
            const response = await request(app)
              .post('/v2/products/')
              .send({
                    title: "Fjallraven  Foldsack No  Backpk ",
                    price: 109.95,
                    description: "' OR '1'='1",
                    category: "women's clothing",
                    stock:200
              }); 
        
            expect(response.status).toBe(401); 
        });
    
        it('should protect against SQL injections on category', async () => {
            const response = await request(app)
              .post('/v2/products/')
              .send({
                    title: "Fjallraven  Foldsack No  Backpk ",
                    price: 109.95,
                    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                    category: "' OR '1'='1",
                    stock:200
              }); 
        
            expect(response.status).toBe(401); 
        });
    
        it('should protect against SQL injections on stock', async () => {
            const response = await request(app)
              .post('/v2/products/')
              .send({
                    title: "Fjallraven  Foldsack No  Backpk ",
                    price: 109.95,
                    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                    category: "women's clothing",
                    stock:"' OR '1'='1"
              }); 
        
            expect(response.status).toBe(401); 
        });
    });
    
    describe('Modify Product Security', () => {
        it('should protect against SQL injections from link', async () => {
          const response = await request(app)
            .put('/v2/products/1 UNION SELECT * FROM products')
            .send({
                title: "Fjallraven  Foldsack No  Backpk ",
                price: 109.95,
                description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                category: "women's clothing",
                stock:200
            }); 
      
          expect(response.status).toBe(401); 
        });
    
    
        it('should protect against SQL injections on title', async () => {
            const response = await request(app)
              .put('/v2/products/6736b6716e8eb4c9228fe3b1')
              .send({
                  title: "' OR '1'='1",
                  price: 109.95,
                  description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                  category: "women's clothing",
                  stock:200
              }); 
        
            expect(response.status).toBe(401); 
        });
    
    
        it('should protect against SQL injections on price', async () => {
            const response = await request(app)
              .put('/v2/products/6736b6716e8eb4c9228fe3b1')
              .send({
                    title: "Fjallraven  Foldsack No  Backpk ",
                    price: "' OR '1'='1",
                    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                    category: "women's clothing",
                    stock:200
              }); 
        
            expect(response.status).toBe(401); 
        });
    
        it('should protect against SQL injections on description', async () => {
            const response = await request(app)
              .put('/v2/products/6736b6716e8eb4c9228fe3b1')
              .send({
                    title: "Fjallraven  Foldsack No  Backpk ",
                    price: 109.95,
                    description: "' OR '1'='1",
                    category: "women's clothing",
                    stock:200
              }); 
        
            expect(response.status).toBe(401); 
        });
    
        it('should protect against SQL injections on category', async () => {
            const response = await request(app)
              .put('/v2/products/6736b6716e8eb4c9228fe3b1')
              .send({
                    title: "Fjallraven  Foldsack No  Backpk ",
                    price: 109.95,
                    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                    category: "' OR '1'='1",
                    stock:200
              }); 
        
            expect(response.status).toBe(401); 
        });
    
        it('should protect against SQL injections on stock', async () => {
            const response = await request(app)
              .put('/v2/products/6736b6716e8eb4c9228fe3b1')
              .send({
                    title: "Fjallraven  Foldsack No  Backpk ",
                    price: 109.95,
                    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                    category: "women's clothing",
                    stock:"' OR '1'='1"
              }); 
        
            expect(response.status).toBe(401); 
        });
    });
    
    describe('Delete Product Security', () => {
        it('should protect against SQL injections', async () => {
          const response = await request(app)
            .delete('/v2/products/6736b6716e8eb4c9228fe3b1')

      
          expect(response.status).toBe(401); 
        });
    });
});





describe("JWT and role protections", () => {

  const token = jwt.sign({ userToLogin: { role: 'Gestionnaire' } }, config.jwtSecret);
const unauthorizedToken = jwt.sign({ userToLogin: { role: 'User' } }, config.jwtSecret);

describe('Product Routes', () => {

  let productId:mongoose.Types.ObjectId;
  
  beforeAll(async () => {
      const product = new MongoProduct({ title: 'monProduit', price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  });
      await product.save();
      productId = new mongoose.Types.ObjectId(product._id);
  });

  describe('POST /v2/products', () => {

    it('should return 403 if user lacks required role', async () => {
      const newProduct = {
        title: 'Unauthorized Product',
        description: 'Product description',
        price: 200,
        category: 'Category',
        stock: 50
      };

      const response = await request(app)
        .post('/v2/products')
        .set('Authorization', `Bearer ${unauthorizedToken}`)
        .send(newProduct);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({});
    });
  });


  describe('PUT /v2/products/:id', () => {
    it('should return 403 if user lacks required role', async () => {
      const updatedProduct = {
        title: 'Updated Product',
        description: 'Updated description',
        price: 300,
        category: 'Updated Category',
        stock: 75
      };

      const response = await request(app)
        .put(`/v2/products/${productId}`)
        .set('Authorization', `Bearer ${unauthorizedToken}`)
        .send(updatedProduct);
      expect(response.status).toBe(403);
    });


  });


  describe('DELETE /v2/products/:id', () => {

    it('should return 403 if user lacks required role', async () => {
      const response = await request(app)
        .delete(`/v2/products/${productId}`)
        .set('Authorization', `Bearer ${unauthorizedToken}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({});
    });
  });
});
})